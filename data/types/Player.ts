import { ModelBase } from "../baseTypes/Model"

export interface Player extends ModelBase {
  gameId: string
  userId: string
  name?: string
  letters?: number
  secretVision?: string
  color?: string // hex color code
  currentTileLocation?: number | null // 0-15
}
