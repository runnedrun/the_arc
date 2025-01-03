import { queryObs, SKIP } from "@/data/readerFe"
import { MapPosition } from "@/data/types/MapTile"
import { useObs } from "@/data/useObs"
import { isNil } from "lodash-es"
import { useContext } from "react"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { NPCSelector } from "./NPCSelector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const PlayerNPCsDisplay = ({
  selectedPosition,
}: {
  selectedPosition: MapPosition
}) => {
  const { currentPlayer } = useContext(GameInterfaceContext)

  console.log("curr", currentPlayer.uid)

  const npcs =
    useObs(
      queryObs("npcs", ({ where }) => [
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
        where("playerTribeId", "==", currentPlayer.uid || "__never__"),
        where("archived", "==", false),
      ]),
      [selectedPosition?.x, selectedPosition?.y]
    ) || []
  const sortText = isNil(selectedPosition)
    ? currentPlayer.name
    : `Tile ${selectedPosition.x}, ${selectedPosition.y}`
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {npcs.length} NPCs for {sortText}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <NPCSelector npcOptions={npcs}></NPCSelector>
      </CardContent>
    </Card>
  )
}
