import { MapTile } from "@/data/types/MapTile"
import { useState } from "react"
import { GameGrid } from "./components/GameGrid"
import { ObjectivesButton } from "./components/ObjectivesModal"
import { ElderCouncilDisplay } from "./ElderCouncilDisplay"
import { PlayerInfoDisplay } from "./PlayerInfoDisplay"
import { ScoresDisplay } from "./components/ScoresDisplay"

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
    <div className="flex items-start justify-center">
      <div className="flex w-1/4 flex-col gap-3">
        <PlayerInfoDisplay></PlayerInfoDisplay>
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
  )
}
