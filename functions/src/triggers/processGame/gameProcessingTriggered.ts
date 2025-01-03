import { Round } from "@/data/types/Round"
import { queryDocs, readDoc } from "../../helpers/reader"
import { ProcessJobFn } from "../triggerProcessJob"
import { setupGameAtStart } from "./setupGameAtStart"
import { Game } from "@/data/types/Game"
import { Player } from "@/data/types/Player"

export type GameProcessingArgs = {
  game: Game
  currentRound: Round
  players: Player[]
  refresh: () => Promise<void>
}

async function getGameData(gameId: string): Promise<GameProcessingArgs> {
  const data = {} as GameProcessingArgs

  const refresh = async () => {
    const game = await readDoc("games", gameId)
    const players = await queryDocs("players", (ref) => {
      return ref.where("gameId", "==", game.uid).where("archived", "==", false)
    })
    const rounds = await queryDocs("rounds", (ref) => {
      return ref.where("gameId", "==", game.uid).orderBy("index").limit(1)
    })
    const currentRound = rounds[0] || null

    Object.assign(data, {
      game,
      players,
      currentRound,
    } as GameProcessingArgs)
  }

  await refresh()

  return {
    ...data,
    refresh,
  }
}

export const gameProcessingTriggered: ProcessJobFn = async ({ docId }) => {
  const args = await getGameData(docId)
  const shouldProcessGameStarted = !args.game.gameSetupCompletedAt

  if (shouldProcessGameStarted) {
    setupGameAtStart(args)
  }
  return false
}
