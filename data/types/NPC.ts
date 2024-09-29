import { Model } from "../baseTypes/Model"

export type NPC = Model<{
  gameId: string
  name: string
  position?: { x: number; y: number }
  letters: number
  createdRound: number
  personality: string
  type: "tribe" | "elderCouncil"
}>
