import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapTile } from "@/data/types/MapTile"
import { TileWithIndex } from "./GameInterface"
import { GameMessages } from "./GameMessages"
import { useMessageComposition } from "./hooks/useMessageComposition"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { useContext } from "react"
import { isEqual } from "lodash-es"

export const TileHistoryDisplay = ({ tile }: { tile: MapTile }) => {
  const { currentPlayer } = useContext(GameInterfaceContext)
  const { previousMessages, composingMessage, setComposingMessage } =
    useMessageComposition({
      type: ["tileHistory", "tileAction"],
      tileLocation: tile.position,
    })

  console.log("previousMessages", previousMessages)

  const currentPlayerIsOnThisTile = isEqual(
    currentPlayer?.currentTileLocation,
    tile.position
  )

  return (
    <GameMessages
      messages={previousMessages}
      composingMessage={composingMessage}
      updateComposingMessage={setComposingMessage}
      allowComposing={currentPlayerIsOnThisTile}
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
      <CardContent className="flex flex-col gap-3">
        <div>History:</div>
        <TileHistoryDisplay tile={selectedTile}></TileHistoryDisplay>
      </CardContent>
    </Card>
  )
}
