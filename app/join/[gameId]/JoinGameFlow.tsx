"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { UserContext } from "@/data/context/UserContext"
import { docObs, queryObs } from "@/data/readerFe"
import { MapPosition } from "@/data/types/MapTile"
import { useObs } from "@/data/useObs"
import { fbSet, fbUpdate, genExtraData } from "@/data/writerFe"
import { useToast } from "@/hooks/use-toast"
import { isUndefined, omit, uniqueId } from "lodash-es"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { firstValueFrom } from "rxjs"
import { v4 as uuidv4 } from "uuid"
import { JoinAsExistingPlayerDisplay } from "./JoinAsExistingPlayerDisplay"
import axios from "axios"
import { SetupPlayerArgs } from "@/app/api/setup_player/route"

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
  console.log("joinging game")
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

  console.log("eoistint", existingPlayer.uid)

  const uuid = existingPlayer?.uid || uuidv4()
  const baseData = existingPlayer ? omit(existingPlayer, "uid") : genExtraData()

  await fbSet("players", uuid, {
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

  console.log("setup player post", uuid)
  await axios.post("/api/setup_player", {
    gameId,
    playerId: uuid,
  } as SetupPlayerArgs)

  return uuid
}

export function JoinGameFlow({ gameId }: { gameId: string }) {
  const { uid: userId } = useContext(UserContext)?.user || {}
  const [playerName, setPlayerName] = useState("")
  const [playerPersonality, setPlayerPersonality] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const { toast } = useToast()
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

  console.log("existing players for this user", existingPlayersForThisUser)

  const existingPlayer = existingPlayersForThisUser[0] || null

  const isAlreadyPlayer = !!existingPlayer

  console.log("existingPlayer", existingPlayer)

  useEffect(() => {
    if (isAlreadyPlayer) {
      setPlayerName(existingPlayer.name || "")
      setPlayerPersonality(existingPlayer.playerPersonality || "")
    }
  }, [isAlreadyPlayer, existingPlayer])

  if (!game) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Game: {game.name}</CardTitle>
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
          <Button
            onClick={
              isAlreadyPlayer && existingPlayer.hasStartedGame
                ? handleUpdatePlayer
                : handleJoinGame
            }
            disabled={isJoining}
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
