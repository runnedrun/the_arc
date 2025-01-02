import { ModelBase } from "../baseTypes/Model"
import { MapPosition } from "./MapTile"

export interface Player extends ModelBase {
  gameId: string
  userId: string
  name?: string
  letters?: number
  secretVision?: string
  color?: string // hex color code
  currentTileLocation?: MapPosition
}
