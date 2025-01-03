import { Game } from "@/data/types/Game"
import { Player } from "@/data/types/Player"
import { Round } from "@/data/types/Round"
import { readDoc, queryDocs } from "../../helpers/reader"
import { MapTile } from "@/data/types/MapTile"
import { sortBy } from "lodash-es"
import { NPC } from "@/data/types/NPC"
import { Message } from "@/data/types/Message"

export type GameProcessingArgs = {
  game: Game
  currentRound: Round
  players: Player[]
  mapTiles: MapTile[]
  npcs: NPC[]
  elderCouncilDecrees: Message[]
  refresh: () => Promise<void>
}

const ELDER_COUNCIL_MAX_HISTORY_MESSAGES = 100
export async function getGameData(gameId: string): Promise<GameProcessingArgs> {
  const data = {} as GameProcessingArgs

  const refresh = async () => {
    const [game, players, mapTiles, npcs, rounds, elderCouncilDecrees] =
      await Promise.all([
        readDoc("games", gameId),
        queryDocs("players", (ref) => {
          return ref
            .where("gameId", "==", gameId)
            .where("archived", "==", false)
        }),
        queryDocs("mapTiles", (ref) => {
          return ref
            .where("gameId", "==", gameId)
            .where("archived", "==", false)
        }),
        queryDocs("npcs", (ref) => {
          return ref
            .where("gameId", "==", gameId)
            .where("archived", "==", false)
        }),
        queryDocs("rounds", (ref) => {
          return ref.where("gameId", "==", gameId).orderBy("index").limit(1)
        }),
        queryDocs("messages", (ref) =>
          ref
            .where("gameId", "==", gameId)
            .where("senderId", "==", "elderCouncil")
            .where("type", "==", "elderCouncil")
            .orderBy("createdAt", "desc")
            .limit(ELDER_COUNCIL_MAX_HISTORY_MESSAGES)
        ),
      ])

    const currentRound = rounds[0] || null

    Object.assign(data, {
      game,
      players,
      currentRound,
      mapTiles: sortBy(mapTiles, (_) => `${_.position.x},${_.position.y}`),
      npcs,
      elderCouncilDecrees,
    } as GameProcessingArgs)
  }

  await refresh()

  return {
    ...data,
    refresh,
  }
}
