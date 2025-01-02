import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { queryObs } from "@/data/readerFe"
import { MapPosition } from "@/data/types/MapTile"
import { useObs } from "@/data/useObs"
import { fbUpdate } from "@/data/writerFe"
import { Timestamp } from "firebase/firestore"
import { isEqual } from "lodash"
import { useContext, useState } from "react"
import { ProvideTokenCountContext } from "./TokenCountContext"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { NPCsForSelectedTile } from "./NPCsForSelectedTile"

export default function GameInterface() {
  const [selectedTile, setSelectedTile] = useState<
    MapPosition & { index: number }
  >(null)
  const [elderCouncilMessage, setElderCouncilMessage] = useState("")
  const [npcMessage, setNpcMessage] = useState("")
  const {
    players,
    game,
    currentUserId,
    mapTiles,
    currentRound: round,
  } = useContext(GameInterfaceContext)

  const currentPlayer = players.find(
    (player) => player.userId === currentUserId
  )
  const maxLetters = Math.max(0, 300 - game.currentRoundNumber * 10)

  const hasPlayerEndedRound = round?.playersCompletedAt?.[currentUserId] != null
  const isRoundProcessing = round?.processingStartedAt != null

  const handleEndRound = async () => {
    await fbUpdate("rounds", game.currentRoundId, {
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

  const renderGrid = () => {
    return (
      <div className="grid h-64 w-64 grid-cols-4 gap-1">
        {mapTiles.map((tile, index) => {
          const coordinates = tile.position
          const playersOnTile = players.filter((player) =>
            isEqual(player.currentTileLocation, coordinates)
          )

          return (
            <div
              key={tile.uid}
              className="relative flex cursor-pointer items-center justify-center border border-black bg-green-500"
              onClick={() => setSelectedTile({ ...tile.position, index })}
            >
              <span className="font-bold text-white">{index + 1}</span>
              {playersOnTile.map((player, playerIndex) => (
                <div
                  key={player.userId}
                  className="absolute h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: player.color,
                    bottom: `${1 + playerIndex * 4}px`,
                    right: "4px",
                  }}
                />
              ))}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex h-screen items-start justify-center p-4">
      <Card className="mr-4 w-1/4">
        <CardHeader>
          <CardTitle>Player Info</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Name: {currentPlayer?.name}</p>
          <p>Letters: {currentPlayer?.letters}</p>
          <p>Round: {game.currentRoundNumber}</p>
          <p>Max Letters: {maxLetters}</p>
          <Button {...getEndRoundButtonProps()} className="mt-4">
            {getEndRoundButtonProps().children}
          </Button>
          {selectedTile && (
            <div className="mt-4">
              <h3 className="font-bold">Tile {selectedTile.index} Info</h3>
              <NPCsForSelectedTile position={selectedTile} />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-grow justify-center">{renderGrid()}</div>

      <Card className="ml-4 w-1/4">
        <CardHeader>
          <CardTitle>Elder Council</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="mb-4 h-64">
            <p>Elder Council messages will appear here</p>
          </ScrollArea>
          <Input
            value={elderCouncilMessage}
            onChange={(e) => setElderCouncilMessage(e.target.value)}
            placeholder="Message Elder Council..."
          />
          <Button className="mt-2">Send to Council</Button>
        </CardContent>
      </Card>
    </div>
  )
}
