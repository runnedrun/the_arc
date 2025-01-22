import { Timestamp } from "firebase-admin/firestore"
import { fbSet } from "../../helpers/writer"
import { GameProcessingArgs } from "./getGameData"
import { startNewRound } from "./startNewRound"
import { updateGameTiles } from "./updateGameTiles"
import { setupNewPlayers } from "./setupNewPlayers"
import { createObjectives } from "./createObjectives"

export const setupGameAtStart = async (args: GameProcessingArgs) => {
  const newRound = await startNewRound(args)
  const newArgs = { ...args, currentRound: newRound }

  await Promise.all([
    updateGameTiles(newArgs),
    setupNewPlayers(newArgs),
    createObjectives(newArgs),
  ])

  console.log("setup complete")
  await fbSet("games", args.game.uid, {
    gameSetupCompletedAt: Timestamp.now(),
  })
}
