import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { fbUpdate } from "@/data/writerFe"
import { Timestamp } from "firebase/firestore"
import { useContext } from "react"
import GameInterface from "./GameInterface"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { ProvideTokenCountContext } from "./TokenCountContext"
import { triggerProcessOnWrite } from "@/helpers/triggerProcessJobOnWrite"

export function GameDisplay() {
  const { game, players, currentUserId, currentPlayer } =
    useContext(GameInterfaceContext)
  const handleStartGame = async () => {
    await triggerProcessOnWrite(
      fbUpdate("games", game.uid, {
        startTime: Timestamp.now(),
      })
    )
  }

  return (
    <div className="container relative mx-auto p-4">
      {!game || !players || !currentPlayer ? (
        <LoadingState />
      ) : (
        <>
          <ProvideTokenCountContext>
            <GameInterface />
          </ProvideTokenCountContext>

          {!game.gameSetupCompletedAt && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50">
              <div className="rounded-lg bg-white p-6 text-center">
                <h2 className="mb-4 text-xl">Game has not started yet</h2>
                {game.createdBy === currentUserId && (
                  <div className="flex items-center gap-2">
                    <Button onClick={handleStartGame}>Start Game</Button>
                    {!game.gameSetupCompletedAt && game.startTime && (
                      <LoadingSpinner className="h-8 w-8"></LoadingSpinner>
                    )}
                  </div>
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
