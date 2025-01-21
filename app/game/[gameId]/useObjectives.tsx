import { queryObs } from "@/data/readerFe"
import { useObs } from "@/data/useObs"
import { useContext } from "react"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { sortBy } from "lodash-es"

export const useObjectives = () => {
  const { currentPlayer, game } = useContext(GameInterfaceContext)
  const secretObjectives =
    useObs(
      queryObs("messages", ({ where }) => [
        where("gameId", "==", game?.uid || "__never__"),
        where("archived", "==", false),
        where("receiverId", "==", currentPlayer?.uid || "__never__"),
        where("type", "==", "secretObjective"),
      ]),
      [game?.uid, currentPlayer?.uid]
    ) || []

  const publicObjectives =
    useObs(
      queryObs("messages", ({ where }) => [
        where("gameId", "==", game?.uid || "__never__"),
        where("archived", "==", false),
        where("type", "==", "publicObjective"),
      ]),
      [game?.uid, currentPlayer?.uid]
    ) || []

  const secretObjectiveSorted = sortBy(secretObjectives, "roundIndex")
  const publicObjectiveSorted = sortBy(publicObjectives, "roundIndex")

  const allObjectives = [...secretObjectiveSorted, ...publicObjectiveSorted]

  return {
    secretObjectives: secretObjectiveSorted,
    publicObjectives: publicObjectiveSorted,
    allObjectives,
  }
}
