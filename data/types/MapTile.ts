import { Model } from "../baseTypes/Model"
import { Timestamp } from "firebase/firestore"

export type MapPosition = {
  x: number
  y: number
}

export const getDefaultMapTile = (gameId: string, position: MapPosition) => ({
  gameId,
  position,
  explored: false,
  lastImageGeneratedAt: null,
  previousDallePrompt: null,
  imageUrl: null,
})

export type MapTile = Model<{
  gameId: string
  position: MapPosition
  explored: boolean
  lastImageGeneratedAt: Timestamp | null
  previousDallePrompt: string | null
  imageUrl: string | null // Replacing svg field
}>
