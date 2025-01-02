import { readDoc } from "../../helpers/reader"
import { ProcessJobFn } from "../triggerProcessJob"

export const gameProcessingTriggered: ProcessJobFn = async ({ docId }) => {
  const game = await readDoc("games", docId)
  const shouldProcessGameStarted = !game.gameSetupCompletedAt
}
