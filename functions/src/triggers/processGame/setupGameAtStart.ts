import { Timestamp } from "firebase-admin/firestore"
import { fbSet } from "../../helpers/writer"
import { GameProcessingArgs } from "./getGameData"
import { addNewNPCForEachPlayer } from "./setupNPCsForEachPlayer"
import { startNewRound } from "./startNewRound"
import { updateGameTiles } from "./updateGameTiles"
import { assignPlayerSecretVisionsAndSetupPlayerImages } from "./assignPlayerSecretVisionsAndSetupPlayerImages"

export const setupGameAtStart = async (args: GameProcessingArgs) => {
  await Promise.all([
    updateGameTiles(args),
    assignPlayerSecretVisionsAndSetupPlayerImages(args),
  ])
  await startNewRound(args)
  await args.refresh()
  console.log("adding NPCS")
  await addNewNPCForEachPlayer(args)

  console.log("setup complete")
  await fbSet("games", args.game.uid, {
    gameSetupCompletedAt: Timestamp.now(),
  })
}
