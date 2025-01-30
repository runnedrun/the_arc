import { backendNow, fbSet } from "@/functions/src/helpers/writer"
import { getGameData } from "@/functions/src/triggers/processGame/getGameData"
import { setupPlayer } from "@/functions/src/triggers/processGame/setupNewPlayers"
import { updateGameTiles } from "@/functions/src/triggers/processGame/updateGameTiles"
import { createFunctionForCollection } from "../createFunctionForCollection"

export const processPlayer = createFunctionForCollection(
  "players",
  {
    concurrency: {
      key: "event.data.id",
      limit: 1,
    },
  },
  async (player, { step }) => {
    const gameId = player.gameId
    const gameData = await getGameData(gameId)

    if (player && !player.hasStartedGame) {
      console.log("setup-player-started", player.uid)
      await step.run("setup-player-started", async () => {
        await fbSet("players", player.uid, {
          setupStartedAt: backendNow(),
        })
        await setupPlayer(gameData, player)
      })

      console.log("setup-player-completed", player.uid)
      await step.run("setup-player-completed", async () => {
        await gameData.refresh()
        if (gameData.game.gameSetupCompletedAt) {
          await updateGameTiles(gameData)
        }
      })

      console.log("setup-player-completed-at", player.uid)
      await fbSet("players", player.uid, {
        setupCompletedAt: backendNow(),
      })
    }
  }
)
