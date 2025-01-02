import { Game } from "@/data/types/Game"
import { setupGameTilesAtStart } from "./setupGameTilesAtStart"

export const setupGameAtStart = async (game: Game) => {
  setupGameTilesAtStart(game)
}
