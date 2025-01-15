import { Model } from "../baseTypes/Model"
import { Timestamp } from "firebase/firestore"
import { MapPosition } from "./MapTile"

export type Message = Model<{
  gameId: string
  roundId: string
  senderId: string
  receiverId: string
  content: string
  tileLocation: MapPosition
  roundIndex: number
  type: "npc" | "recap" | "tileAction" | "tileHistory" | "elderCouncil"
  processedAt: Timestamp | null
}>
