import { Timestamp } from "firebase/firestore"
import { Model } from "../baseTypes/Model"

export const getDefaultRoundData = () => {
  return {
    gameId: null,
    index: null,
    playersCompletedAt: {},
    processingStartedAt: null,
    processed: false,
  } as Round
}

export type Round = Model<{
  startedAt?: Timestamp
  gameId: string
  index: number
  processingStartedAt: Timestamp | null
  playersCompletedAt: Record<string, Timestamp>
  processed: boolean
}>
