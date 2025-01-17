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
  elderCouncilDiscussion: Message[]
  allElderCouncilActivity: Message[]
  refresh: () => Promise<void>
}

const ELDER_COUNCIL_MAX_HISTORY_MESSAGES = 100
export async function getGameData(gameId: string): Promise<GameProcessingArgs> {
  const data = {} as GameProcessingArgs

  const refresh = async () => {
    const [
      game,
      players,
      mapTiles,
      npcs,
      rounds,
      elderCouncilDiscussion,
      elderCouncilDecrees,
    ] = await Promise.all([
      readDoc("games", gameId),
      queryDocs("players", (ref) => {
        return ref.where("gameId", "==", gameId).where("archived", "==", false)
      }),
      queryDocs("mapTiles", (ref) => {
        return ref.where("gameId", "==", gameId).where("archived", "==", false)
      }),
      queryDocs("npcs", (ref) => {
        return ref.where("gameId", "==", gameId).where("archived", "==", false)
      }),
      queryDocs("rounds", (ref) => {
        return ref
          .where("gameId", "==", gameId)
          .orderBy("index", "desc")
          .limit(1)
      }),
      queryDocs("messages", (ref) =>
        ref
          .where("gameId", "==", gameId)
          .where("type", "==", "elderCouncil")
          .orderBy("createdAt", "desc")
          .limit(ELDER_COUNCIL_MAX_HISTORY_MESSAGES)
      ),
      queryDocs("messages", (ref) =>
        ref
          .where("gameId", "==", gameId)
          .where("type", "==", "councilDecree")
          .orderBy("createdAt", "desc")
          .limit(ELDER_COUNCIL_MAX_HISTORY_MESSAGES)
      ),
    ])

    const allElderCouncilActivity = sortBy(
      [...elderCouncilDecrees, ...elderCouncilDiscussion],
      (m) => m.createdAt.toDate()
    )

    const currentRound = rounds[0] || null

    Object.assign(data, {
      game,
      players,
      currentRound,
      mapTiles: sortBy(mapTiles, (_) => `${_.position.x},${_.position.y}`),
      npcs,
      elderCouncilDiscussion,
      elderCouncilDecrees,
      allElderCouncilActivity,
    } as GameProcessingArgs)
  }

  await refresh()

  return {
    ...data,
    refresh,
  }
}
