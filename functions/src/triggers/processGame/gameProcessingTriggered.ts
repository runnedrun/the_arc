import { ProcessJobFn } from "../triggerProcessJob"
import { setupGameAtStart } from "./setupGameAtStart"
import { getGameData } from "./getGameData"

export const gameProcessingTriggered: ProcessJobFn = async ({ docId }) => {
  const args = await getGameData(docId)
  const shouldProcessGameStarted = !args.game.gameSetupCompletedAt

  if (shouldProcessGameStarted) {
    setupGameAtStart(args)
  }
  return false
}
