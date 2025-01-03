import { MapTile } from "@/data/types/MapTile"
import { useState } from "react"
import { GameGrid } from "./components/GameGrid"
import { ElderCouncilDisplay } from "./ElderCouncilDisplay"
import { PlayerInfoDisplay } from "./PlayerInfoDisplay"
import { PlayerNPCsDisplay } from "./PlayerNPCsDisplay"

export type TileWithIndex = MapTile & { index: number }

export default function GameInterface() {
  const [selectedTile, setSelectedTile] = useState<TileWithIndex>(null)

  const setOrToggleTile = (newTile: TileWithIndex) => {
    if (newTile?.uid === selectedTile?.uid) {
      setSelectedTile(null)
    } else {
      setSelectedTile(newTile)
    }
  }

  return (
    <div className="flex h-screen items-start justify-center p-4">
      <div className="flex w-1/4 flex-col gap-3">
        <PlayerInfoDisplay></PlayerInfoDisplay>
        <PlayerNPCsDisplay
          selectedPosition={selectedTile?.position}
        ></PlayerNPCsDisplay>
      </div>

      <div className="flex flex-grow justify-center">
        <GameGrid onTileSelect={setOrToggleTile} selectedTile={selectedTile} />
      </div>

      <ElderCouncilDisplay></ElderCouncilDisplay>
    </div>
  )
}
