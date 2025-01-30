import { getGameData } from "@/functions/src/triggers/processGame/getGameData"
import { setupGameAtStart } from "@/functions/src/triggers/processGame/setupGameAtStart"
import { safeSetTestMode } from "@/helpers/getUuid"
import { createFunctionForCollection } from "../createFunctionForCollection"

export const processGame = createFunctionForCollection(
  "games",
  {
    concurrency: {
      key: "event.data.id",
      limit: 1,
    },
  },
  async (game) => {
    const docId = game.uid
    const args = await getGameData(docId)
    const shouldProcessGameStarted = !args.game.gameSetupCompletedAt

    await safeSetTestMode(args.game.isTestGame, async () => {
      if (shouldProcessGameStarted) {
        await setupGameAtStart(args)
      }
    })
  }
)
