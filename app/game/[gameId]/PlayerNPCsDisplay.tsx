import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { queryObs, SKIP } from "@/data/readerFe"
import { MapPosition } from "@/data/types/MapTile"
import { useObs } from "@/data/useObs"
import { isNil } from "lodash-es"
import { NPCSelector } from "./NPCSelector"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { useContext } from "react"

export const NPCsForTileDisplay = ({
  selectedPosition,
}: {
  selectedPosition: MapPosition
}) => {
  const { game } = useContext(GameInterfaceContext)
  const npcs =
    useObs(
      queryObs("npcs", ({ where }) => [
        where("gameId", "==", game?.uid || "__never__"),
        where(
          "currentTileLocation.x",
          "==",
          isNil(selectedPosition?.x) ? SKIP : selectedPosition.x
        ),
        where(
          "currentTileLocation.y",
          "==",
          isNil(selectedPosition?.y) ? SKIP : selectedPosition.y
        ),
      ]),
      [selectedPosition?.x, selectedPosition?.y]
    ) || []

  return <NPCSelector npcOptions={npcs}></NPCSelector>
}
