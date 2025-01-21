import { MapPosition, MapTile } from "@/data/types/MapTile"
import { groupBy, isEqual, sortBy } from "lodash-es"
import { useContext } from "react"
import { GameInterfaceContext } from "../GameInterfaceContext"
import { NPCsMarker, PlayerMarker } from "./PlayerMarker"
import { TileInfoDisplay } from "../TileInfoDisplay"
import { TileWithIndex } from "../GameInterface"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { PopoverContent } from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { CardinalDirections } from "./CardinalDirections"

interface GameGridProps {
  onTileSelect: (position: MapTile & { index: number }) => void
  selectedTile: TileWithIndex
  onTileClosed: (tile: TileWithIndex) => void
}

export function GameGrid({
  onTileSelect,
  selectedTile,
  onTileClosed,
}: GameGridProps) {
  const { mapTiles, players, npcs } = useContext(GameInterfaceContext)
  const mapTilesSorted = sortBy(mapTiles, (tile) => {
    return `${tile.position.y},${tile.position.x}`
  })

  return (
    <div className="relative">
      <div className="absolute -left-[78px] -top-[78px] w-full">
        <CardinalDirections />
      </div>
      <div className="grid grid-cols-4 gap-1">
        {mapTilesSorted.map((tile, index) => {
          const coordinates = tile.position
          const playersOnTile = players.filter((player) =>
            isEqual(player.currentTileLocation, coordinates)
          )
          const npcsOnTile = npcs.filter((npc) =>
            isEqual(npc.currentTileLocation, coordinates)
          )

          const npcsGroupedByPlayer = groupBy(
            npcsOnTile,
            (npc) => npc.playerTribeId
          )

          const thisTileIsSelected =
            selectedTile && index === selectedTile?.index

          return (
            <div
              key={tile.uid}
              className={cn(
                "relative flex cursor-pointer items-center justify-center border-2 border-black",
                {
                  "z-50": thisTileIsSelected,
                  "border-blue-500": thisTileIsSelected,
                  "bg-green-500": tile.explored,
                  "bg-gray-700": !tile.explored,
                  "cursor-pointer": tile.explored,
                }
              )}
            >
              <Popover
                open={thisTileIsSelected}
                onOpenChange={(open) => {
                  if (!open) {
                    onTileClosed({ ...tile, index })
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <div
                    onClick={() => {
                      tile.explored && onTileSelect({ ...tile, index })
                    }}
                    className={cn(
                      "flex h-[100px] w-[100px] items-center justify-center"
                    )}
                  >
                    {tile.explored && tile.imageUrl ? (
                      <Image
                        src={tile.imageUrl}
                        alt={`Tile ${index + 1}`}
                        className="h-full w-full object-cover"
                        width={100}
                        height={100}
                      />
                    ) : (
                      <span
                        className={cn(
                          "font-bold",
                          tile.explored ? "text-white" : "text-gray-500"
                        )}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="relative flex max-h-[850px] w-[600px] flex-col"
                  side="right"
                  align="start"
                  sideOffset={5}
                  alignOffset={0}
                  avoidCollisions
                >
                  <button
                    onClick={() => onTileClosed({ ...tile, index })}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-gray-200"
                    aria-label="Close"
                  >
                    ✕
                  </button>
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

              {tile.explored &&
                Object.entries(npcsGroupedByPlayer).map(([playerId, npcs]) => {
                  const player = players.find(
                    (player) => player.uid === playerId
                  )

                  const playerIndex = players.findIndex(
                    (player) => player.uid === playerId
                  )
                  return (
                    <div
                      key={playerId}
                      className="absolute"
                      style={{
                        left: "4px",
                        bottom: `${1 + playerIndex * 4}px`,
                      }}
                    >
                      <NPCsMarker
                        npcs={npcs}
                        playerForNPC={player}
                      ></NPCsMarker>
                    </div>
                  )
                })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
