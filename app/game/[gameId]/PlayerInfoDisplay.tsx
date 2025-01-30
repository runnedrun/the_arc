import { LoadingComponent } from "@/components/LoadingComponent"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { useContext, useState } from "react"
import { EndRoundButton } from "./EndRoundButton"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { TokenCountContext } from "./TokenCountContext"
import { PlayerInfoModal } from "./components/PlayerInfoModal"
import { PlayerMarker } from "./components/PlayerMarker"

export const PlayerInfoDisplay = () => {
  const {
    players,
    currentUserId,
    currentRound: round,
  } = useContext(GameInterfaceContext)

  const { charactersAvailable, charactersRemaining } =
    useContext(TokenCountContext)

  const currentPlayer = players.find(
    (player) => player.userId === currentUserId
  )

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
        <EndRoundButton />
      </CardContent>
    </Card>
  )
}
