import { Timestamp } from "firebase-admin/firestore"
import { fbSet } from "../../helpers/writer"
import { GameProcessingArgs } from "./getGameData"
import { addNewNPCForEachPlayerAtGameStart } from "./setupNPCsForEachPlayer"
import { startNewRound } from "./startNewRound"
import { updateGameTiles } from "./updateGameTiles"
import { setupPlayerImages } from "./setupPlayerImages"
import { createObjectives } from "./createObjectives"

export const setupGameAtStart = async (args: GameProcessingArgs) => {
  const newRound = await startNewRound(args)
  const newArgs = { ...args, currentRound: newRound }

  await Promise.all([
    updateGameTiles(newArgs),
    setupPlayerImages(newArgs),
    addNewNPCForEachPlayerAtGameStart(newArgs),
    createObjectives(newArgs),
  ])

  console.log("setup complete")
  await fbSet("games", args.game.uid, {
    gameSetupCompletedAt: Timestamp.now(),
  })
}
