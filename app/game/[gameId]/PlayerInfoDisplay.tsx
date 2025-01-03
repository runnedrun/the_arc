import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fbUpdate } from "@/data/writerFe"
import { Timestamp } from "firebase/firestore"
import { useContext } from "react"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { TokenCountContext } from "./TokenCountContext"
import { PlayerMarker } from "./components/PlayerMarker"

export const PlayerInfoDisplay = () => {
  const {
    players,
    game,
    currentUserId,
    currentRound: round,
  } = useContext(GameInterfaceContext)

  const { charactersAvailable, charactersRemaining } =
    useContext(TokenCountContext)

  const currentPlayer = players.find(
    (player) => player.userId === currentUserId
  )

  const hasPlayerEndedRound = round?.playersCompletedAt?.[currentUserId] != null
  const isRoundProcessing = round?.processingStartedAt != null

  const handleEndRound = async () => {
    await fbUpdate("rounds", round.uid, {
      playersCompletedAt: {
        [currentUserId]: Timestamp.now(),
      },
    })
  }

  const getEndRoundButtonProps = () => {
    if (isRoundProcessing) {
      return {
        disabled: true,
        children: "Updating stories...",
      }
    }
    if (hasPlayerEndedRound) {
      return {
        disabled: true,
        children: "Waiting on other players",
      }
    }
    return {
      disabled: false,
      children: "End Round",
      onClick: handleEndRound,
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{currentPlayer?.name}</CardTitle>
          <PlayerMarker player={currentPlayer}></PlayerMarker>
        </div>
      </CardHeader>
      <CardContent>
        <p>Round: {round?.index}</p>
        <p>
          Letters: {charactersRemaining}/{charactersAvailable}
        </p>
        <Button {...getEndRoundButtonProps()} className="mt-4">
          {getEndRoundButtonProps().children}
        </Button>
      </CardContent>
    </Card>
  )
}
