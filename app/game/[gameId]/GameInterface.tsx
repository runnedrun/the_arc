import { MapTile } from "@/data/types/MapTile"
import { useState } from "react"
import { GameGrid } from "./components/GameGrid"
import { ObjectivesButton } from "./components/ObjectivesModal"
import { ElderCouncilDisplay } from "./ElderCouncilDisplay"
import { PlayerInfoDisplay } from "./PlayerInfoDisplay"
import { ScoresDisplay } from "./components/ScoresDisplay"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMediaQuery } from "react-responsive"

export type TileWithIndex = MapTile & { index: number }

export default function GameInterface() {
  const [selectedTile, setSelectedTile] = useState<TileWithIndex>(null)
  const isDesktop = useMediaQuery({ minWidth: 768 })

  const setOrToggleTile = (newTile: TileWithIndex) => {
    setSelectedTile((currentTile) => {
      if (currentTile?.uid === newTile?.uid) {
        return null
      }
      return newTile
    })
  }

  const closeTile = (tile: TileWithIndex) => {
    if (tile?.uid === selectedTile?.uid) {
      setSelectedTile(null)
    }
  }

  return (
    <div className="h-full w-full">
      {isDesktop ? (
        <div className="flex items-start justify-center">
          <div className="flex w-1/4 flex-col gap-3">
            <PlayerInfoDisplay />
            <ScoresDisplay />
          </div>

          <div className="flex flex-grow justify-center p-4">
            <GameGrid
              onTileSelect={setOrToggleTile}
              selectedTile={selectedTile}
              onTileClosed={closeTile}
            />
          </div>

          <div className="ml-4 flex h-[700px] w-1/4 flex-col gap-2">
            <ObjectivesButton />
            <ElderCouncilDisplay />
          </div>
        </div>
      ) : (
        <Tabs defaultValue="map" className="flex h-full w-full flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="info" className="flex-1">
              Info
            </TabsTrigger>
            <TabsTrigger value="map" className="flex-1">
              Map
            </TabsTrigger>
            <TabsTrigger value="council" className="flex-1">
              Council
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4 flex min-h-0 grow flex-col">
            <div className="flex min-h-0 grow flex-col gap-3">
              <PlayerInfoDisplay />
              <ScoresDisplay />
            </div>
          </TabsContent>

          <TabsContent value="map" className="min-h-0 grow flex-col">
            <div className="flex min-h-0 grow justify-center p-4">
              <GameGrid
                onTileSelect={setOrToggleTile}
                selectedTile={selectedTile}
                onTileClosed={closeTile}
              />
            </div>
          </TabsContent>

          <TabsContent value="council" className="flex min-h-0 grow flex-col">
            <div className="flex min-h-0 grow flex-col gap-2">
              <ObjectivesButton />
              <ElderCouncilDisplay />
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
