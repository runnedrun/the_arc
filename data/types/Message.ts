import { Model } from "../baseTypes/Model"
import { Timestamp } from "firebase/firestore"

export type Message = Model<{
  gameId: string
  roundId: string
  senderId: string
  receiverId: string
  content: string
  tileId?: string
  processedAt: Timestamp | null
}>
