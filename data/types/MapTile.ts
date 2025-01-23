import { Model } from "../baseTypes/Model"
import { Timestamp } from "firebase/firestore"

export type MapPosition = {
  x: number
  y: number
}

export type MapTile = Model<{
  gameId: string
  position: MapPosition
  explored: boolean
  exploredInRoundId: string
  exploredInRoundIndex: number
  lastImageGeneratedAt: Timestamp | null

  previousDallePrompt: string | null
  imageUrl: string | null // Replacing svg field
  title: string | null
  description: string | null
}>
