import { queryDocs } from "../../helpers/reader"
import { GameProcessingArgs } from "../processGame/getGameData"

export const generateElderCouncilMessages = async ({
  mapTiles,
  currentRound,
  game,
}: GameProcessingArgs) => {
  const newHistoryEntriesFromThisRound = mapTiles.flatMap((tile) => {
    return tile.history.filter((entry) => entry.roundId === currentRound.uid)
  })

  const allMessagesSentToElderCouncil = await queryDocs("messages", (ref) => {
    return ref
      .where("gameId", "==", game.uid)
      .where("type", "==", "elderCouncil")
      .where("archived", "==", false)
  })
}
