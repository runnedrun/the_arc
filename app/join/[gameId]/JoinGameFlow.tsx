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

export function JoinGameFlow({ gameId }: { gameId: string }) {
  const { uid: userId } = useContext(UserContext)?.user || {}
  const [playerName, setPlayerName] = useState("")
  const [secretVision, setSecretVision] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Get game data
  const game = useObs(docObs("games", gameId), [gameId])

  if (isUndefined(game)) {
    return <Skeleton className="h-48 w-full" />
  }

  // Check if user is already a player
  const existingPlayers =
    useObs(
      queryObs("players", ({ where }) => [
        where("gameId", "==", gameId),
        where("userId", "==", userId),
      ]),
      [gameId, userId]
    ) || []

  const existingPlayer = existingPlayers[0] || null

  const isAlreadyPlayer = !!existingPlayer

  console.log("existingPlayer", existingPlayer)

  useEffect(() => {
    if (isAlreadyPlayer) {
      setPlayerName(existingPlayer.name || "")
      setSecretVision(existingPlayer.secretVision || "")
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

  const handleJoinGame = async () => {
    if (!secretVision.trim()) {
      toast({
        title: "Secret Vision Required",
        description: "Please enter your vision for the valley's future.",
        variant: "destructive",
      })
      return
    }

    setIsJoining(true)

    // Get current players to determine the new player's index
    const existingPlayers = await firstValueFrom(
      queryObs("players", ({ where }) => [where("gameId", "==", gameId)])
    )

    const mapSize = game.mapSize // Get map size from game data

    console.log("mapsize")

    // Assign corner based on player count
    let mapPosition = existingPlayer?.currentTileLocation

    if (!mapPosition) {
      const cornerPositions: MapPosition[] = [
        { y: 0, x: 0 }, // Top-left
        { y: 0, x: mapSize - 1 }, // top-right
        { y: mapSize - 1, x: 0 }, // Bottom-left
        { y: mapSize - 1, x: mapSize - 1 }, // Bottom-right
      ]
      const positionIndex = existingPlayers.length

      mapPosition = cornerPositions[positionIndex]
    }

    // Define an array of distinct colors
    const playerColors = [
      "#FF6B6B", // Red
      "#4ECDC4", // Teal
      "#45B7D1", // Blue
      "#96CEB4", // Sage
      "#FFEEAD", // Yellow
      "#D4A5A5", // Pink
      "#9B59B6", // Purple
      "#3498DB", // Light Blue
      "#E67E22", // Orange
      "#2ECC71", // Green
    ]

    // Get the next color based on the number of existing players
    const colorIndex = existingPlayers.length % playerColors.length
    const playerColor = playerColors[colorIndex]

    const uuid = existingPlayer?.uid || uniqueId()

    const baseData = existingPlayer
      ? omit(existingPlayer, "uid")
      : genExtraData()

    console.log("start", mapPosition, mapSize)

    await fbSet("players", uuid, {
      ...baseData,
      gameId,
      userId,
      name: playerName || "New Player",
      letters: 500,
      secretVision: secretVision.trim(),
      color: playerColor,
      currentTileLocation: mapPosition,
    })

    toast({
      title: "Welcome to the game!",
      description: "You've successfully joined the game.",
    })

    router.push(`/game/${gameId}`)
    setIsJoining(false)
  }

  const handleUpdateName = async () => {
    try {
      setIsJoining(true)
      await fbUpdate("players", existingPlayer.uid, {
        name: playerName,
      })
      toast({
        title: "Name Updated",
        description: "Your player name has been updated.",
      })
      router.push(`/game/${gameId}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update name. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsJoining(false)
    }
  }

  const gameHasStarted = game?.startTime != null

  if (gameHasStarted && !isAlreadyPlayer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Game Already Started</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Sorry, this game has already begun and is not accepting new players.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (gameHasStarted && !isAlreadyPlayer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Update Your Information</CardTitle>
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
              />
            </div>
            <div>
              <label className="text-sm font-medium">Secret Vision</label>
              <Textarea
                value={secretVision}
                disabled={true}
                className="mt-1 resize-none bg-muted"
                rows={3}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Your secret vision cannot be changed once set
              </p>
            </div>
            <Button
              onClick={handleUpdateName}
              disabled={isJoining}
              className="w-full"
            >
              {isJoining ? "Updating..." : "Update Name"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

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
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              Secret Vision (Required)
            </label>
            <Textarea
              value={secretVision}
              onChange={(e) => setSecretVision(e.target.value.slice(0, 200))}
              placeholder="Enter your vision for the valley's future (max 200 characters)"
              className="mt-1 resize-none"
              rows={3}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {secretVision.length}/200 characters
            </p>
          </div>
          <Button
            onClick={handleJoinGame}
            disabled={isJoining || !secretVision.trim()}
            className="w-full"
          >
            {isJoining ? "Joining..." : "Join Game"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
