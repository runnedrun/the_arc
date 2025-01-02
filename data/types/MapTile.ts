import { Model } from "../baseTypes/Model"

export type MapPosition = {
  x: number
  y: number
}

export type MapTile = Model<{
  gameId: string
  position: MapPosition
  history: { roundId?: string; entryText: string }[]
  svg: string
}>
