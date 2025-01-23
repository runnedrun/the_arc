import { Timestamp } from "firebase-admin/firestore"
import { fbSet } from "../../helpers/writer"
import { createObjectives } from "./createObjectives"
import { GameProcessingArgs } from "./getGameData"
import { startNewRound } from "./startNewRound"
import { updateGameTiles } from "./updateGameTiles"

export const setupGameAtStart = async (args: GameProcessingArgs) => {
  const newRound = await startNewRound(args)
  const newArgs = { ...args, currentRound: newRound }

  await Promise.all([updateGameTiles(newArgs), createObjectives(newArgs)])

  console.log("setup complete")
  await fbSet("games", args.game.uid, {
    gameSetupCompletedAt: Timestamp.now(),
  })
}
