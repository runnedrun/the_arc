import { queryObs, SKIP } from "@/data/readerFe"
import { MapPosition } from "@/data/types/MapTile"
import { useObs } from "@/data/useObs"
import { isNil } from "lodash-es"
import { useContext } from "react"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { NPCSelector } from "./NPCSelector"
import { NPC } from "@/data/types/NPC"

export const NPCsForTileDisplay = ({
  selectedPosition,
  onSelectNpc,
}: {
  selectedPosition: MapPosition
  onSelectNpc: (npc: NPC) => void
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

  return <NPCSelector npcOptions={npcs} onSelectNpc={onSelectNpc}></NPCSelector>
}
