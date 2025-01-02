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
  playersCompletedAt: Record<string, Timestamp>
  processingStartedAt: Timestamp | null
  processed: boolean
}>
