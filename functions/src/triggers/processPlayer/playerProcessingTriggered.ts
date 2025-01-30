import { readDoc } from "../../helpers/reader"
import { backendNow, fbSet } from "../../helpers/writer"
import { getGameData } from "../processGame/getGameData"
import { setupPlayer } from "../processGame/setupNewPlayers"
import { updateGameTiles } from "../processGame/updateGameTiles"
import { ProcessJobFn } from "../triggerProcessJob"

export const playerProcessingTriggered: ProcessJobFn = async ({ docId }) => {
  const player = await readDoc("players", docId)
  const gameId = player.gameId
  const gameData = await getGameData(gameId)

  if (player && !player.hasStartedGame) {
    await fbSet("players", docId, {
      setupStartedAt: backendNow(),
    })
    await setupPlayer(gameData, player)
    await gameData.refresh()
    if (gameData.game.gameSetupCompletedAt) {
      await updateGameTiles(gameData)
    }
    await fbSet("players", docId, {
      setupCompletedAt: backendNow(),
    })
  }

  return false
}
