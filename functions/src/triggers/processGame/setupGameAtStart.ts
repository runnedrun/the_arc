import { Timestamp } from "firebase-admin/firestore"
import { fbSet } from "../../helpers/writer"
import { GameProcessingArgs } from "./getGameData"
import { addNewNPCForEachPlayer } from "./setupNPCsForEachPlayer"
import { startNewRound } from "./startNewRound"
import { updateGameTiles } from "./updateGameTiles"
import { assignPlayerSecretVisionsAndSetupPlayerImages } from "./assignPlayerSecretVisionsAndSetupPlayerImages"

export const setupGameAtStart = async (args: GameProcessingArgs) => {
  const newRound = await startNewRound(args)
  await Promise.all([
    updateGameTiles(args),
    assignPlayerSecretVisionsAndSetupPlayerImages(args),
    addNewNPCForEachPlayer({ ...args, currentRound: newRound }),
  ])

  console.log("setup complete")
  await fbSet("games", args.game.uid, {
    gameSetupCompletedAt: Timestamp.now(),
  })
}
