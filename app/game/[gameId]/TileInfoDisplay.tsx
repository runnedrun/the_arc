import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapTile } from "@/data/types/MapTile"
import { TileWithIndex } from "./GameInterface"
import { GameMessages } from "./GameMessages"
import { useMessageComposition } from "./hooks/useMessageComposition"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { useContext } from "react"
import { isEqual } from "lodash-es"
import Image from "next/image"
import { NPCsForTileDisplay } from "./PlayerNPCsDisplay"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const TileHistoryDisplay = ({ tile }: { tile: MapTile }) => {
  const { currentPlayer } = useContext(GameInterfaceContext)
  const {
    previousMessages,
    composingMessage,
    setComposingMessage,
    sendMessage,
  } = useMessageComposition({
    types: ["tileHistory", "tileAction"],
    tileLocation: tile.position,
    senderId: currentPlayer?.uid,
  })

  const currentPlayerIsOnThisTile = isEqual(
    currentPlayer?.currentTileLocation,
    tile.position
  )

  return (
    <GameMessages
      messages={previousMessages}
      composingMessage={composingMessage}
      updateComposingMessage={setComposingMessage}
      sendMessage={currentPlayerIsOnThisTile ? sendMessage : undefined}
    />
  )
}

export const TileInfoDisplay = ({
  selectedTile,
}: {
  selectedTile: TileWithIndex
}) => {
  return (
    <Card className="mr-4 w-full">
      <CardHeader>
        <CardTitle>
          Tile Info ({selectedTile.position.x}, {selectedTile.position.y})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="npcs">NPCs</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="flex flex-col gap-3">
            <div className="flex w-full justify-center">
              <Image
                src={selectedTile.imageUrl}
                alt="Tile Image"
                width={250}
                height={250}
              />
            </div>
            <div>History:</div>
            <TileHistoryDisplay tile={selectedTile}></TileHistoryDisplay>
          </TabsContent>

          <TabsContent value="npcs">
            <NPCsForTileDisplay selectedPosition={selectedTile.position} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
