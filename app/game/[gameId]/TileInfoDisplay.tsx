import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapTile } from "@/data/types/MapTile"
import { TileWithIndex } from "./GameInterface"
import { ScrollArea } from "@radix-ui/react-scroll-area"

export const TileHistoryDisplay = ({ tile }: { tile: MapTile }) => {
  return (
    <ScrollArea className="h-48">
      {tile.history.map((entry, i) => {
        return <div key={i}>{entry.entryText}</div>
      })}
    </ScrollArea>
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
