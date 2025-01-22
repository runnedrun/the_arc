import { UserContext } from "@/data/context/UserContext"
import { docObs, queryObs } from "@/data/readerFe"
import { Game } from "@/data/types/Game"
import { MapTile } from "@/data/types/MapTile"
import { NPC } from "@/data/types/NPC"
import { Player } from "@/data/types/Player"
import { Round } from "@/data/types/Round"
import { useObs } from "@/data/useObs"
import { limit } from "firebase/firestore"
import { isNil } from "lodash-es"
import { createContext, useContext } from "react"

interface GameInterfaceContext {
  game: Game
  players: Player[]
  currentUserId: string
  currentRound: Round
  mapTiles: MapTile[]
  currentPlayer: Player
  playersHaveLoaded: boolean
  npcs: NPC[]
  playerHasEndedRound: boolean
  userHasLoaded: boolean
}

export const GameInterfaceContext = createContext(null as GameInterfaceContext)

export const ProvideGameInterfaceContext = ({
  children,
  gameId,
}: React.PropsWithChildren<{ gameId: string }>) => {
  const game = useObs(docObs("games", gameId), [gameId])

  const players = useObs(
    queryObs("players", ({ where }) => [
      where("gameId", "==", gameId),
      where("archived", "==", false),
    ]),
    [gameId]
  )

  const playersArray = players || []
  const playersHaveLoaded = !isNil(players)

  const npcs =
    useObs(
      queryObs("npcs", ({ where }) => [
        where("gameId", "==", gameId),
        where("archived", "==", false),
      ]),
      [gameId]
    ) || []

  const mapTiles = useObs(
    queryObs("mapTiles", ({ where }) => [
      where("gameId", "==", gameId),
      where("archived", "==", false),
    ]),
    [gameId]
  )

  const currentRoundArray =
    useObs(
      queryObs("rounds", ({ where, orderBy }) => [
        where("gameId", "==", game?.uid || "__never__"),
        where("archived", "==", false),
        orderBy("index", "desc"),
        limit(1),
      ]),
      [game?.uid]
    ) || []

  const currentRound = currentRoundArray[0]

  const userContext = useContext(UserContext)
  const userHasLoaded = !isNil(userContext?.loading)

  const currentUserId = userContext?.user?.uid

  const currentPlayer = playersArray.find((_) => _.userId === currentUserId)

  const playerHasEndedRound =
    !!currentRound?.playersCompletedAt?.[currentPlayer?.uid]

  return (
    <GameInterfaceContext.Provider
      value={{
        currentPlayer,
        currentUserId,
        game,
        mapTiles,
        players: playersArray,
        playersHaveLoaded,
        currentRound,
        npcs,
        playerHasEndedRound,
        userHasLoaded,
      }}
    >
      {children}
    </GameInterfaceContext.Provider>
  )
}
