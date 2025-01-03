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
      className={cn("h-3 w-3 rounded-full", className)}
      style={{
        backgroundColor: player.color,
      }}
    />
  )
}
