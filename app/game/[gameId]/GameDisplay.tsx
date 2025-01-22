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
import { GameEnvironmentControl } from "@/app/game/[gameId]/GameEnvironmentControl"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"

export function GameDisplay() {
  const {
    game,
    players,
    currentUserId,
    currentPlayer,
    playersHaveLoaded,
    userHasLoaded,
  } = useContext(GameInterfaceContext)
  const handleStartGame = async () => {
    await triggerProcessOnWrite(
      fbUpdate("games", game.uid, {
        startTime: Timestamp.now(),
      })
    )
  }

  if (playersHaveLoaded && userHasLoaded && !currentPlayer) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <div>You are not a player in this game</div>
          <Link href={`/join/${game?.uid}`}>
            <Button variant="outline">Join game</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen items-start justify-center p-4">
      <div className="container relative h-full">
        {!game || !players || !currentPlayer ? (
          <LoadingState />
        ) : (
          <>
            <ProvideTokenCountContext>
              <GameInterface />
            </ProvideTokenCountContext>

            <Dialog open={!game.gameSetupCompletedAt} modal>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Game has not started yet</DialogTitle>
                </DialogHeader>
                {game.createdBy === currentUserId && (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-center gap-2">
                      <Button onClick={handleStartGame}>Start Game</Button>
                      {!game.gameSetupCompletedAt && game.startTime && (
                        <LoadingSpinner className="h-8 w-8" />
                      )}
                    </div>
                    <GameEnvironmentControl />
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
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
