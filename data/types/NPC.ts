import { getUuid } from "@/helpers/getUuid"
import { Model } from "../baseTypes/Model"
import { MapPosition } from "./MapTile"

export const getNpcId = () => {
  return `__npc-${getUuid()}`
}

export const idIsNpc = (id: string) => {
  return id?.startsWith("__npc-")
}

export type NPC = Model<{
  gameId: string
  name: string
  currentTileLocation?: MapPosition
  letters?: number
  createdRoundIndex?: number
  createdRoundId: string
  playerTribeId?: string
  personality?: string
  imageUrl?: string
  active: boolean
}>
