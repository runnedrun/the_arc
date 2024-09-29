import { Model } from "../baseTypes/Model"

type PlayerState = "active" | "ended"

export type Round = Model<{
  gameId: string
  index: number
  playerStates: Record<string, PlayerState>
  processed: boolean
}>
