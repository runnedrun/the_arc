import { Timestamp } from "firebase-admin/firestore"
import { fbSet } from "../../helpers/writer"
import { GameProcessingArgs } from "./gameProcessingTriggered"
import { setupGameTilesAtStart } from "./setupGameTilesAtStart"
import { addNewNPCForEachPlayer } from "./setupNPCsForEachPlayer"
import { startNewRound } from "./startNewRound"

export const setupGameAtStart = async (args: GameProcessingArgs) => {
  await setupGameTilesAtStart(args)
  await startNewRound(args)
  await args.refresh()
  await addNewNPCForEachPlayer(args)

  console.log("setup complete")
  await fbSet("games", args.game.uid, {
    gameSetupCompletedAt: Timestamp.now(),
  })
}
