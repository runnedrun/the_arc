import { NPC } from "@/data/types/NPC"
import { Player } from "@/data/types/Player"
import { cn } from "@/lib/utils"

export const PlayerMarker = ({
  player,
  className,
}: {
  player: Player
  className?: string
}) => {
  return (
    <div
      key={player.userId}
      className={cn("h-3 w-3 rounded-full border border-black", className)}
      style={{
        backgroundColor: player.color,
      }}
    />
  )
}

export const NPCsMarker = ({
  npcs,
  playerForNPC,
  className,
}: {
  npcs: NPC[]
  playerForNPC: Player
  className?: string
}) => {
  return (
    <div className="relative">
      <div
        className={cn("h-3 w-3 border border-black bg-gray-400", className)}
      />
      <div className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white">
        {npcs.length}
      </div>
    </div>
  )
}
