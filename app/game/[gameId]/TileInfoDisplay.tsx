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
import {
  TileInfoDisplayProvider,
  useTileInfoDisplay,
} from "./TileInfoDisplayContext"
import { cn } from "@/lib/utils"

export const TileHistoryDisplay = ({ tile }: { tile: MapTile }) => {
  const { currentPlayer } = useContext(GameInterfaceContext)
  const { messages, composingMessage, setComposingMessage, sendMessage } =
    useMessageComposition({
      typesToShow: ["tileAction", "tileHistory", "tileMovement"],
      tileLocation: tile.position,
      senderId: currentPlayer?.uid,
      typeToSend: "tileAction",
    })

  const currentPlayerIsOnThisTile = isEqual(
    currentPlayer?.currentTileLocation,
    tile.position
  )

  return (
    <GameMessages
      allowClicking
      messages={messages}
      composingMessage={composingMessage}
      updateComposingMessage={setComposingMessage}
      sendMessage={currentPlayerIsOnThisTile ? sendMessage : undefined}
    />
  )
}

const TileInfoDisplayContent = ({
  selectedTile,
}: {
  selectedTile: TileWithIndex
}) => {
  const { selectedTab, setSelectedTab } = useTileInfoDisplay()

  return (
    <div className="flex min-h-0 grow flex-col">
      <CardHeader>
        <CardTitle className="flex flex-col items-center gap-3">
          <div className="text-2xl">{selectedTile.title}</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 grow flex-col">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="flex min-h-0 grow flex-col"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">History</TabsTrigger>
            <TabsTrigger value="npcs">NPCs</TabsTrigger>
          </TabsList>

          <TabsContent
            value="info"
            className="data-[state=active]:flex data-[state=active]:min-h-0 data-[state=active]:grow data-[state=active]:flex-col data-[state=active]:gap-3"
          >
            <div className="flex w-full justify-center">
              <Image
                src={selectedTile.imageUrl}
                alt="Tile Image"
                className="h-28 w-28 md:h-48 md:w-48"
                width={200}
                height={200}
              />
            </div>
            <TileHistoryDisplay tile={selectedTile}></TileHistoryDisplay>
          </TabsContent>

          <TabsContent
            value="npcs"
            className="min-h-0 grow flex-col data-[state=active]:flex"
          >
            <NPCsForTileDisplay selectedPosition={selectedTile.position} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  )
}

export const TileInfoDisplay = ({
  selectedTile,
}: {
  selectedTile: TileWithIndex
}) => {
  return (
    <TileInfoDisplayProvider openTile={selectedTile}>
      <TileInfoDisplayContent selectedTile={selectedTile} />
    </TileInfoDisplayProvider>
  )
}
