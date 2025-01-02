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
import { getDefaultRoundData } from "@/data/types/Round"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { ProvideTokenCountContext } from "./TokenCountContext"

export function GameDisplay() {
  const { game, players, currentUserId } = useContext(GameInterfaceContext)
  const handleStartGame = async () => {
    const roundRef = await fbUpdate("rounds", game.currentRoundId, {
      ...getDefaultRoundData(),
      startedAt: null,
    })
    await fbUpdate("games", game.uid, {
      startTime: Timestamp.now(),
      currentRoundId: roundRef.id,
    })
  }

  return (
    <div className="container relative mx-auto p-4">
      {!game || !players ? (
        <LoadingState />
      ) : (
        <>
          <ProvideTokenCountContext>
            <GameInterface />
          </ProvideTokenCountContext>

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
