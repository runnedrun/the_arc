import { Model } from "../baseTypes/Model"
import { Timestamp } from "firebase/firestore"
import { MapPosition } from "./MapTile"

export const getDefaultMessage = (
  overrides: Partial<Message> = {}
): Message => ({
  gameId: null,
  roundId: null,
  senderId: null,
  receiverId: null,
  content: null,
  tileLocation: null,
  roundIndex: null,
  type: null,
  processingTriggeredAt: null,
  processingStartedAt: null,
  processedAt: null,
  draft: false,
  ...overrides,
})

export type Message = Model<{
  gameId: string
  roundId: string
  senderId: string
  receiverId: string
  content: string
  tileLocation: MapPosition
  roundIndex: number
  type:
    | "npc"
    | "recap"
    | "tileAction"
    | "tileHistory"
    | "elderCouncil"
    | "councilDecree"
  processingTriggeredAt: Timestamp | null
  processingStartedAt: Timestamp | null
  processedAt: Timestamp | null
  draft: boolean
}>
