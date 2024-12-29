import { ModelBase } from "../baseTypes/Model"

export interface Player extends ModelBase {
  gameId: string
  userId: string
  name: string
  letters: number
}
