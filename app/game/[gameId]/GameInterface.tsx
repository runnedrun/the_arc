import { MapTile } from "@/data/types/MapTile"
import { useState } from "react"
import { GameGrid } from "./components/GameGrid"
import { ElderCouncilDisplay } from "./ElderCouncilDisplay"
import { PlayerInfoDisplay } from "./PlayerInfoDisplay"
import { NPCsForTileDisplay } from "./PlayerNPCsDisplay"

export type TileWithIndex = MapTile & { index: number }

export default function GameInterface() {
  const [selectedTile, setSelectedTile] = useState<TileWithIndex>(null)

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
    <div className="flex h-screen items-start justify-center p-4">
      <div className="flex w-1/4 flex-col gap-3">
        <PlayerInfoDisplay></PlayerInfoDisplay>
      </div>

      <div className="flex flex-grow justify-center p-4">
        <GameGrid
          onTileSelect={setOrToggleTile}
          selectedTile={selectedTile}
          onTileClosed={closeTile}
        />
      </div>

      <ElderCouncilDisplay></ElderCouncilDisplay>
    </div>
  )
}
