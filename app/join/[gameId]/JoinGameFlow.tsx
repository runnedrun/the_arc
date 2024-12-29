"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { docObs, queryObs } from "@/data/readerFe"
import { fbCreate, fbUpdate } from "@/data/writerFe"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { useObs } from "@/data/useObs"
import { UserContext } from "@/data/context/UserContext"
import { isUndefined } from "lodash"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"

export function JoinGameFlow({ gameId }: { gameId: string }) {
  const { uid: userId } = useContext(UserContext)?.user || {}
  const [playerName, setPlayerName] = useState("")
  const [secretVision, setSecretVision] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Get game data
  const game = useObs(docObs("games", gameId))

  if (isUndefined(game)) {
    return <Skeleton className="h-48 w-full" />
  }

  // Check if user is already a player
  const existingPlayer = useObs(
    queryObs("players", ({ where }) => [
      where("gameId", "==", gameId),
      where("userId", "==", userId),
    ])
  )

  const isAlreadyPlayer = existingPlayer && existingPlayer.length > 0

  useEffect(() => {
    if (isAlreadyPlayer) {
      setPlayerName(existingPlayer[0].name || "")
      setSecretVision(existingPlayer[0].secretVision || "")
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

    try {
      setIsJoining(true)
      await fbCreate("players", {
        gameId,
        userId,
        name: playerName || "New Player",
        letters: 500,
        secretVision: secretVision.trim(),
      })
      toast({
        title: "Welcome to the game!",
        description: "You've successfully joined the game.",
      })
      router.push(`/game/${gameId}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join the game. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsJoining(false)
    }
  }

  const handleUpdateName = async () => {
    if (!existingPlayer?.[0]) return

    try {
      setIsJoining(true)
      await fbUpdate("players", existingPlayer[0].uid, {
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
