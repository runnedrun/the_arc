import { ModelBase } from "../baseTypes/Model"
import { MapPosition } from "./MapTile"

export interface Player extends ModelBase {
  gameId: string
  userId: string
  name?: string
  letters?: number
  playerPersonality?: string
  playerImageUrl?: string
  color?: string // hex color code
  currentTileLocation?: MapPosition
}
