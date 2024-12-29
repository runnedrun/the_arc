import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Player } from "@/data/types/Player"
import { Game } from "@/data/types/Game"

interface GameInterfaceProps {
  game: Game
  players: Player[]
  currentUserId: string
}

export default function GameInterface({
  game,
  players,
  currentUserId,
}: GameInterfaceProps) {
  const [selectedTile, setSelectedTile] = useState<number | null>(null)
  const [elderCouncilMessage, setElderCouncilMessage] = useState("")
  const [npcMessage, setNpcMessage] = useState("")

  const currentPlayer = players.find(
    (player) => player.userId === currentUserId
  )
  const maxLetters = Math.max(0, 300 - game.currentRound * 10)

  const handleTileClick = (tileNumber: number) => {
    setSelectedTile(tileNumber)
  }

  const handleEndRound = () => {
    console.log("Round ended")
  }

  const renderGrid = () => {
    return (
      <div className="grid h-64 w-64 grid-cols-4 gap-1">
        {game.valleyGrid.map((tileId, index) => {
          const playersOnTile = players.filter(
            (player) => player.currentTileLocation === index
          )

          return (
            <div
              key={tileId}
              className="relative flex cursor-pointer items-center justify-center border border-black bg-green-500"
              onClick={() => handleTileClick(index + 1)}
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

  console.log(currentPlayer)

  return (
    <div className="flex h-screen items-start justify-center p-4">
      <Card className="mr-4 w-1/4">
        <CardHeader>
          <CardTitle>Player Info</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Name: {currentPlayer?.name}</p>
          <p>Letters: {currentPlayer?.letters}</p>
          <p>Round: {game.currentRound}</p>
          <p>Max Letters: {maxLetters}</p>
          <Button onClick={handleEndRound} className="mt-4">
            End Round
          </Button>
          {selectedTile && (
            <div className="mt-4">
              <h3 className="font-bold">Tile {selectedTile} Info</h3>
              <ScrollArea className="mt-2 h-40">
                <p>NPC messages will appear here</p>
              </ScrollArea>
              <Input
                value={npcMessage}
                onChange={(e) => setNpcMessage(e.target.value)}
                placeholder="Message NPC..."
                className="mt-2"
              />
              <Button className="mt-2">Send to NPC</Button>
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
