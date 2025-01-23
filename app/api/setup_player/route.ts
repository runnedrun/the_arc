export const maxDuration = 45

import { getBeAppNext } from "@/functions/src/helpers/initAppNextBackend"
import { getGameData } from "@/functions/src/triggers/processGame/getGameData"
import { setupPlayer } from "@/functions/src/triggers/processGame/setupNewPlayers"
import { updateGameTiles } from "@/functions/src/triggers/processGame/updateGameTiles"
import { NextRequest, NextResponse } from "next/server"

export type SetupPlayerArgs = {
  gameId: string
  playerId: string
}

export async function POST(req: NextRequest) {
  getBeAppNext()

  const { gameId, playerId } = (await req.json()) as SetupPlayerArgs

  const gameData = await getGameData(gameId)
  const player = gameData.players.find((p) => p.uid === playerId)

  if (player && !player.hasStartedGame) {
    await setupPlayer(gameData, player)
    await gameData.refresh()
    if (gameData.game.gameSetupCompletedAt) {
      await updateGameTiles(gameData)
    }
  }

  return NextResponse.json({ success: true })
}
