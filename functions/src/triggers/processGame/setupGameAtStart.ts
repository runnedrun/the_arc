import { Timestamp } from "firebase-admin/firestore"
import { fbSet } from "../../helpers/writer"
import { GameProcessingArgs } from "./getGameData"
import { addNewNPCForEachPlayer } from "./setupNPCsForEachPlayer"
import { startNewRound } from "./startNewRound"
import { updateGameTiles } from "./updateGameTiles"

export const setupGameAtStart = async (args: GameProcessingArgs) => {
  await updateGameTiles(args)
  await startNewRound(args)
  await args.refresh()
  await addNewNPCForEachPlayer(args)

  console.log("setup complete")
  await fbSet("games", args.game.uid, {
    gameSetupCompletedAt: Timestamp.now(),
  })
}
