import { UserLoading } from "@/components/UserLoading"
import { docObs, queryObs } from "@/data/readerFe"
import { useObs } from "@/data/useObs"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import GameInterface from "./GameInterface"
import { useContext } from "react"
import { UserContext } from "@/data/context/UserContext"
import { Button } from "@/components/ui/button"
import { fbUpdate } from "@/data/writerFe"
import { Timestamp } from "firebase/firestore"

export function GameDisplay({ gameId }: { gameId: string }) {
  // Load game data
  const gameObs = docObs("games", gameId)
  const game = useObs(gameObs)

  // Load players in this game
  const playersObs = queryObs("players", ({ where }) => [
    where("gameId", "==", gameId),
  ])
  const players = useObs(playersObs)

  const currentUserId = useContext(UserContext)?.user?.uid

  const handleStartGame = async () => {
    await fbUpdate("games", gameId, {
      startTime: Timestamp.now(),
    })
  }

  return (
    <div className="container relative mx-auto p-4">
      {!game || !players ? (
        <LoadingState />
      ) : (
        <>
          <GameInterface
            game={game}
            players={players}
            currentUserId={currentUserId}
          />

          {!game.startTime && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50">
              <div className="rounded-lg bg-white p-6 text-center">
                <h2 className="mb-4 text-xl">Game has not started yet</h2>
                {game.createdBy === currentUserId && (
                  <Button onClick={handleStartGame}>Start Game</Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <Card className="p-6">
      <Skeleton className="mb-4 h-8 w-48" />
      <div className="space-y-4">
        <div>
          <Skeleton className="mb-2 h-6 w-32" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div>
          <Skeleton className="mb-2 h-6 w-32" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </Card>
  )
}
