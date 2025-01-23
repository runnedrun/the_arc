import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fbUpdate } from "@/data/writerFe"
import { Timestamp } from "firebase/firestore"
import { useContext } from "react"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { TokenCountContext } from "./TokenCountContext"
import { PlayerMarker } from "./components/PlayerMarker"
import { triggerProcessOnWrite } from "@/helpers/triggerProcessJobOnWrite"
import { LoadingComponent } from "@/components/LoadingComponent"
import { Info } from "lucide-react"
import { PlayerInfoModal } from "./components/PlayerInfoModal"
import { useState } from "react"
import Image from "next/image"

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

  const hasPlayerEndedRound =
    round?.playersCompletedAt?.[currentPlayer.uid] != null
  const isRoundProcessing = round?.processingStartedAt != null

  const handleEndRound = async () => {
    await triggerProcessOnWrite(
      fbUpdate("rounds", round.uid, {
        playersCompletedAt: {
          [currentPlayer.uid]: Timestamp.now(),
        },
      })
    )
  }

  const getEndRoundButtonProps = () => {
    if (isRoundProcessing) {
      return {
        // disabled: true,
        onClick: handleEndRound,
        children: "Updating stories...",
      }
    }
    if (hasPlayerEndedRound) {
      return {
        // disabled: true,
        onClick: handleEndRound,
        children: "Waiting on other players",
      }
    }
    return {
      disabled: false,
      children: "End Round",
      onClick: handleEndRound,
    }
  }

  const [showPlayerInfo, setShowPlayerInfo] = useState(false)

  return (
    <Card className="w-full">
      <CardHeader>
        <LoadingComponent isLoading={!currentPlayer}>
          <div className="flex items-center gap-2">
            {currentPlayer?.playerImageUrl && (
              <Image
                className="cursor-pointer"
                onClick={() => setShowPlayerInfo(true)}
                src={currentPlayer?.playerImageUrl || ""}
                alt={currentPlayer?.name || ""}
                width={50}
                height={50}
              />
            )}
            <CardTitle>{currentPlayer?.name}</CardTitle>
            <PlayerMarker player={currentPlayer}></PlayerMarker>
          </div>
        </LoadingComponent>
      </CardHeader>

      <PlayerInfoModal
        player={currentPlayer}
        open={showPlayerInfo}
        onOpenChange={setShowPlayerInfo}
      />

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
