import { Model } from "../baseTypes/Model"

export type Player = Model<{
  gameId: string
  name: string
  secretVision: string
  letterCount: number
  position: { x: number; y: number }
  latestConnectionPing: number
}>
