"use client"

import { GameEnvironmentControl } from "@/app/game/[gameId]/GameEnvironmentControl"
import { Delay } from "@/components/Delay"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { UserContext } from "@/data/context/UserContext"
import { docObs, queryObs } from "@/data/readerFe"
import { MapPosition } from "@/data/types/MapTile"
import { useObs } from "@/data/useObs"
import { fbSet, fbUpdate, genExtraData } from "@/data/writerFe"
import { triggerProcessOnWrite } from "@/helpers/triggerProcessJobOnWrite"
import { isUndefined, omit } from "lodash-es"
import { useRouter, useSearchParams } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { firstValueFrom } from "rxjs"
import { v4 as uuidv4 } from "uuid"
import { JoinAsExistingPlayerDisplay } from "./JoinAsExistingPlayerDisplay"

export const TutorialDisplay = () => {
  return (
    <div className="text flex flex-col gap-4">
      <div>
        Welcome to The Arc, a game where you bend the arc of history— one letter
        at a time.
      </div>

      <div>
        You are about to enter Arcon, a world on the cusp of great change. The
        Arcon Council has chosen you, a promising young leader, for missions of
        great importance.
      </div>

      <div>
        The missions will be shaped by the personality you describe below.
        You'll have 5 rounds (years) to achieve each one.
      </div>

      <div>
        To achieve your mission you will spend your most precious resource—
        letters. You will start with 300 letters each round, with which you can
        act directly, chat with NPCs, or influence the council.
      </div>

      <div>
        Spend them wisely and you may find yourself at the center of this new
        world, waste them and you'll fade into obscurity
      </div>
    </div>
  )
}

export async function joinGame({
  gameId,
  userId,
  playerName,
  existingPlayer = null,
  playerPersonality = "",
}: {
  gameId: string
  userId: string
  playerName: string
  existingPlayer?: any | null
  playerPersonality?: string
}) {
  // Get current players to determine the new player's index
  const existingPlayers = await firstValueFrom(
    queryObs("players", ({ where }) => [where("gameId", "==", gameId)])
  )

  // Get game data
  const game = await firstValueFrom(docObs("games", gameId))
  const mapSize = game.mapSize

  // Assign corner based on player count
  let mapPosition = existingPlayer?.currentTileLocation

  if (!mapPosition) {
    const cornerPositions: MapPosition[] = [
      { y: 0, x: 0 }, // Top-left
      { y: 0, x: mapSize - 1 }, // top-right
      { y: mapSize - 1, x: 0 }, // Bottom-left
      { y: mapSize - 1, x: mapSize - 1 }, // Bottom-right
    ]
    const positionIndex = existingPlayers.length % cornerPositions.length
    mapPosition = cornerPositions[positionIndex]
  }

  const playerColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEEAD",
    "#D4A5A5",
    "#9B59B6",
    "#3498DB",
    "#E67E22",
    "#2ECC71",
  ]

  const colorIndex = existingPlayers.length % playerColors.length
  const playerColor = playerColors[colorIndex]

  const uuid = existingPlayer?.uid || uuidv4()
  const baseData = existingPlayer ? omit(existingPlayer, "uid") : genExtraData()

  await triggerProcessOnWrite(
    fbSet("players", uuid, {
      ...baseData,
      gameId,
      userId,
      name: playerName || "New Player",
      color: playerColor,
      currentTileLocation: mapPosition,
      playerPersonality,
      secretObjectivePoints: 0,
      publicObjectivePoints: 0,
      secretObjectivesScored: [],
      publicObjectivesScored: [],
    })
  )

  return uuid
}

export const showTutorialParamName = "showTutorial"

export function JoinGameFlow({ gameId }: { gameId: string }) {
  const searchParams = useSearchParams()
  const showTutorial = searchParams.get(showTutorialParamName)
  const { uid: userId } = useContext(UserContext)?.user || {}
  const [playerName, setPlayerName] = useState("")
  const [playerPersonality, setPlayerPersonality] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const router = useRouter()

  // Get game data
  const game = useObs(docObs("games", gameId), [gameId])

  if (isUndefined(game)) {
    return <Skeleton className="h-48 w-full" />
  }

  // Check if user is already a player
  const existingPlayersForThisUser =
    useObs(
      queryObs("players", ({ where }) => [
        where("gameId", "==", gameId),
        where("userId", "==", userId),
      ]),
      [gameId, userId]
    ) || []

  const existingPlayer = existingPlayersForThisUser[0] || null

  const isAlreadyPlayer = !!existingPlayer

  useEffect(() => {
    if (isAlreadyPlayer) {
      setPlayerName(existingPlayer.name || "")
      setPlayerPersonality(existingPlayer.playerPersonality || "")
    }
  }, [isAlreadyPlayer, existingPlayer])

  if (!game) {
    return (
      <Delay waitTime={500}>
        <div className="flex h-screen flex-col items-center justify-center gap-6">
          <LoadingSpinner />
        </div>
      </Delay>
    )
  }

  if (game && !game.createdAt) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Game Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Sorry, we couldn't find a game with that ID.</p>
        </CardContent>
      </Card>
    )
  }

  if (!isAlreadyPlayer) {
    return <JoinAsExistingPlayerDisplay gameId={gameId} userId={userId} />
  }

  const handleJoinGame = async () => {
    setIsJoining(true)

    await joinGame({
      gameId,
      userId,
      playerName,
      existingPlayer,
      playerPersonality,
    })

    router.push(`/game/${gameId}`)

    setIsJoining(false)
  }

  const handleUpdatePlayer = async () => {
    await fbUpdate("players", existingPlayer.uid, {
      name: playerName,
      playerPersonality,
    })
    router.push(`/game/${gameId}`)
  }

  const gameHasStarted = game?.startTime != null

  const isCreator = game.createdBy === userId

  return (
    <Card>
      <CardHeader>
        {showTutorial ? (
          <TutorialDisplay />
        ) : (
          <CardTitle>Join Game: {game.name}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Player Name</label>
            <Input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="mt-1"
              disabled={gameHasStarted && existingPlayer?.hasStartedGame}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Character Personality</label>
            <Textarea
              value={playerPersonality}
              onChange={(e) => setPlayerPersonality(e.target.value)}
              placeholder="Describe your character's personality..."
              className="mt-1"
              disabled={gameHasStarted && existingPlayer?.hasStartedGame}
            />
          </div>
          {isCreator && (
            <GameEnvironmentControl game={game} currentUserId={userId} />
          )}
          <Button
            onClick={
              isAlreadyPlayer && existingPlayer.hasStartedGame
                ? handleUpdatePlayer
                : handleJoinGame
            }
            disabled={
              isJoining ||
              !game.environmentName ||
              !playerPersonality ||
              !playerName
            }
            className="w-full"
          >
            {isJoining ? "Joining game..." : "Join Game"}
          </Button>
          <div className="flex w-full justify-center">
            <Button
              variant="link"
              onClick={() =>
                fbSet("players", existingPlayer.uid, { userId: null })
              }
            >
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
