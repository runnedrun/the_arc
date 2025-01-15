import { getUuid } from "@/helpers/getUuid"
import { Model } from "../baseTypes/Model"
import { MapPosition } from "./MapTile"
import { Player } from "./Player"

export const getNpcId = () => {
  return `__npc-${getUuid()}`
}

export const idIsNpc = (id: string) => {
  return id.startsWith("__npc-")
}

export const getNPCDataForPlayer = (
  player: Player,
  currentRoundNumber: number
) => {
  return {
    gameId: player.gameId,
    name: `NPC - ${player.name}`,
    currentTileLocation: player.currentTileLocation,
    letters: player.letters,
    createdRound: currentRoundNumber,
    playerTribeId: player.uid,
  } as NPC
}

export type NPC = Model<{
  gameId: string
  name: string
  currentTileLocation?: MapPosition
  letters?: number
  createdRound?: number
  playerTribeId?: string
}>
