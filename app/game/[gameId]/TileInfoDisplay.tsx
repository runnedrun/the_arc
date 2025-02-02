import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapTile } from "@/data/types/MapTile"
import { isEqual } from "lodash-es"
import { useContext, useState } from "react"
import { TileWithIndex } from "./GameInterface"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { GameMessages } from "./GameMessages"
import { useMessageComposition } from "./hooks/useMessageComposition"
import { NPCsForTileDisplay } from "./PlayerNPCsDisplay"
import {
  TileInfoDisplayProvider,
  useTileInfoDisplay,
} from "./TileInfoDisplayContext"
import { ImageWithModal } from "../components/ImageWithModal"
import { NPCDisplay } from "./NPCDisplay"
import { NPC } from "@/data/types/NPC"

export const TileHistoryDisplay = ({ tile }: { tile: MapTile }) => {
  const { currentPlayer } = useContext(GameInterfaceContext)
  const { messages, composingMessage, setComposingMessage, sendMessage } =
    useMessageComposition({
      typesToShow: ["tileAction", "tileHistory", "tileMovement"],
      tileLocation: tile.position,
      senderId: currentPlayer?.uid,
      typeToSend: "tileAction",
      viewingPlayerId: currentPlayer?.uid,
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
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null)

  const imageToShow =
    selectedTab === "info" ? selectedTile.imageUrl : selectedNPC?.imageUrl

  const title = selectedTab === "info" ? selectedTile.title : selectedNPC?.name

  return (
    <div className="flex min-h-0 grow flex-col">
      <CardHeader>
        <CardTitle className="flex flex-col gap-4">
          <div className="font-light">
            {selectedTab === "npcs" ? (
              <div className="text-sm">{selectedTile.title}</div>
            ) : null}
          </div>
          {title && (
            <ImageWithModal
              key={selectedTab}
              src={imageToShow}
              alt={title}
              title={title}
              description={
                selectedTab === "info"
                  ? selectedTile.description
                  : selectedNPC.personality
              }
              imageClassName="h-16 w-16 rounded-md hover:opacity-80"
            />
          )}
          {selectedTab === "npcs" && (
            <NPCsForTileDisplay
              selectedPosition={selectedTile.position}
              onSelectNpc={setSelectedNPC}
            />
          )}
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
            <TileHistoryDisplay tile={selectedTile}></TileHistoryDisplay>
          </TabsContent>

          <TabsContent
            value="npcs"
            className="min-h-0 grow flex-col data-[state=active]:flex"
          >
            {selectedNPC && <NPCDisplay npc={selectedNPC} />}
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
