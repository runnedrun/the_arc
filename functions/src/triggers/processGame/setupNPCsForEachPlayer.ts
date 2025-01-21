import { GameProcessingArgs } from "./getGameData"
import { getNpcForGame } from "./getNpcForGame"

export const addNewNPCForEachPlayerAtGameStart = async (
  args: GameProcessingArgs
) => {
  await Promise.all(
    args.players.map((player) => {
      return getNpcForGame(args, player.currentTileLocation, true)
    })
  )
}
