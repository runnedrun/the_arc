import { MapPosition, MapTile } from "@/data/types/MapTile"
import { isEqual, sortBy } from "lodash-es"
import { useContext } from "react"
import { GameInterfaceContext } from "../GameInterfaceContext"
import { PlayerMarker } from "./PlayerMarker"
import { TileInfoDisplay } from "../TileInfoDisplay"
import { TileWithIndex } from "../GameInterface"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { PopoverContent } from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"

interface GameGridProps {
  onTileSelect: (position: MapTile & { index: number }) => void
  selectedTile: TileWithIndex
}

export function GameGrid({ onTileSelect, selectedTile }: GameGridProps) {
  const { mapTiles, players } = useContext(GameInterfaceContext)
  const mapTilesSorted = sortBy(mapTiles, (tile) => {
    return `${tile.position.y},${tile.position.x}`
  })
  return (
    <div className="grid h-64 w-64 grid-cols-4 gap-1">
      {mapTilesSorted.map((tile, index) => {
        const coordinates = tile.position
        const playersOnTile = players.filter((player) =>
          isEqual(player.currentTileLocation, coordinates)
        )

        const thisTileIsSelected = selectedTile && index === selectedTile?.index

        return (
          <div
            key={tile.uid}
            className={cn(
              "relative flex cursor-pointer items-center justify-center border border-black bg-green-500",
              { "z-50": thisTileIsSelected }
            )}
          >
            <Popover>
              <PopoverTrigger asChild>
                <div
                  onClick={() => onTileSelect({ ...tile, index })}
                  className="flex h-full w-full items-center justify-center"
                >
                  {tile.svg ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: tile.svg }}
                      className="w-44"
                    />
                  ) : (
                    <span className="font-bold text-white">{index + 1}</span>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <TileInfoDisplay
                  selectedTile={{ ...tile, index }}
                ></TileInfoDisplay>
              </PopoverContent>
            </Popover>

            {playersOnTile.map((player, playerIndex) => (
              <div
                key={player.uid}
                className="absolute"
                style={{
                  right: "4px",
                  bottom: `${1 + playerIndex * 4}px`,
                }}
              >
                <PlayerMarker player={player}></PlayerMarker>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
