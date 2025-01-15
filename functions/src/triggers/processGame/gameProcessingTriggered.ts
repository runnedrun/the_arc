import { safeSetTestMode } from "@/helpers/getUuid"
import { ProcessJobFn } from "../triggerProcessJob"
import { getGameData } from "./getGameData"
import { setupGameAtStart } from "./setupGameAtStart"

export const gameProcessingTriggered: ProcessJobFn = async ({ docId }) => {
  const args = await getGameData(docId)
  const shouldProcessGameStarted = !args.game.gameSetupCompletedAt

  await safeSetTestMode(args.game.isTestGame, async () => {
    if (shouldProcessGameStarted) {
      await setupGameAtStart(args)
    }
  })

  return false
}
