import { Button } from "@/components/ui/button"
import { fbUpdate } from "@/data/writerFe"
import { triggerProcessOnWrite } from "@/helpers/triggerProcessJobOnWrite"
import { Timestamp } from "firebase/firestore"
import { useContext } from "react"
import { GameInterfaceContext } from "./GameInterfaceContext"

export const EndRoundButton = () => {
  const {
    players,

    currentUserId,
    currentRound: round,
  } = useContext(GameInterfaceContext)

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

  return (
    <Button {...getEndRoundButtonProps()} className="mt-4">
      {getEndRoundButtonProps().children}
    </Button>
  )
}
