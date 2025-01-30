import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            key={player.userId}
            className={cn(
              "h-3 w-3 rounded-full border border-black",
              className
            )}
            style={{
              backgroundColor: player.color,
            }}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{player.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const NPCsMarker = ({
  npcs,
  className,
}: {
  npcs: NPC[]
  playerForNPC: Player
  className?: string
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="relative">
            <div
              className={cn(
                "h-3 w-3 border border-black bg-gray-400",
                className
              )}
            />
            <div className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white">
              {npcs.length}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{npcs.map((npc) => npc.name).join(", ")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
