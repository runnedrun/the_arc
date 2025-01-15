import { ProcessJobFn } from "../triggerProcessJob"
import { setupGameAtStart } from "./setupGameAtStart"
import { getGameData } from "./getGameData"
import { setTestMode } from "@/helpers/getUuid"

export const gameProcessingTriggered: ProcessJobFn = async ({ docId }) => {
  const args = await getGameData(docId)
  const shouldProcessGameStarted = !args.game.gameSetupCompletedAt

  if (shouldProcessGameStarted) {
    if (args.game.isTestGame) {
      setTestMode(true)
      await setupGameAtStart(args)
    }
  }
  return false
}
