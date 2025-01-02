import { queryObs } from "@/data/readerFe"
import { NPC } from "@/data/types/NPC"
import { useObs } from "@/data/useObs"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { MapPosition } from "@/data/types/MapTile"
import { NPCDisplay } from "./NPCDisplay"

export function NPCsForSelectedTile({ position }: { position: MapPosition }) {
  const [open, setOpen] = useState(false)
  const [selectedNpc, setSelectedNpc] = useState<NPC>()

  const npcs = useObs(
    queryObs("npcs", ({ where }) => [
      where("currentTileLocation.x", "==", position?.x || "__never__"),
      where("currentTileLocation.y", "==", position?.y || "__never__"),
    ]),
    [position?.x, position?.y]
  )

  return (
    <div className="flex flex-col gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {selectedNpc?.name || "Select NPC..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search NPCs..." />
            <CommandEmpty>No NPCs on this tile.</CommandEmpty>
            <CommandGroup>
              {npcs?.map((npc) => (
                <CommandItem
                  key={npc.uid}
                  onSelect={() => {
                    setSelectedNpc(npc)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedNpc?.uid === npc.uid ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {npc.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedNpc && <NPCDisplay npc={selectedNpc} />}
    </div>
  )
}
