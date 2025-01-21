import { MapTile } from "@/data/types/MapTile"
import { NPC } from "@/data/types/NPC"
import { createContext, useContext, useState, ReactNode } from "react"

type TileInfoDisplayContextType = {
  selectedTab: string
  setSelectedTab: (tab: string) => void
  selectedNPC: NPC | undefined
  setSelectedNPC: (npc: NPC | undefined) => void
  openTile: MapTile
}

export const TileInfoDisplayContext = createContext<TileInfoDisplayContextType>(
  {
    selectedTab: "info",
    setSelectedTab: () => {},
    selectedNPC: undefined,
    setSelectedNPC: () => {},
    openTile: undefined,
  }
)

export function TileInfoDisplayProvider({
  children,
  openTile,
}: {
  children: ReactNode
  openTile: MapTile
}) {
  const [selectedTab, setSelectedTab] = useState("info")
  const [selectedNPC, setSelectedNPC] = useState<NPC | undefined>()

  return (
    <TileInfoDisplayContext.Provider
      value={{
        selectedTab,
        setSelectedTab,
        selectedNPC,
        setSelectedNPC,
        openTile,
      }}
    >
      {children}
    </TileInfoDisplayContext.Provider>
  )
}

export const useTileInfoDisplay = () => useContext(TileInfoDisplayContext)
