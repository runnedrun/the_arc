import { getNPCDataForPlayer } from "@/data/types/NPC"
import { fbCreate } from "../../helpers/writer"
import { GameProcessingArgs } from "./getGameData"

export const addNewNPCForEachPlayer = async ({
  players,
  currentRound,
}: GameProcessingArgs) => {
  const roundIndex = currentRound?.index || 0
  await Promise.all(
    players.map((player) => {
      const npc = getNPCDataForPlayer(player, roundIndex)
      return fbCreate("npcs", npc)
    })
  )
}
