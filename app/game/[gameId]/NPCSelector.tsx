import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { NPC } from "@/data/types/NPC"
import { CommandItem } from "cmdk"
import { ChevronsUpDown } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { NPCDisplay } from "./NPCDisplay"
import { useTileInfoDisplay } from "./TileInfoDisplayContext"

export function NPCSelector({
  npcOptions,
  onSelectNpc,
}: {
  npcOptions: NPC[]
  onSelectNpc: (npc: NPC) => void
}) {
  const [open, setOpen] = useState(false)
  const { selectedNPC, setSelectedNPC } = useTileInfoDisplay()

  useEffect(() => {
    if (npcOptions?.length && !selectedNPC) {
      onSelectNpc(npcOptions[0])
      setSelectedNPC(npcOptions[0])
    }
  }, [npcOptions, selectedNPC, setSelectedNPC])

  return (
    <div className="flex min-h-0 grow flex-col gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            <div className="flex items-center gap-2">
              {selectedNPC?.imageUrl && (
                <Image
                  src={selectedNPC.imageUrl}
                  alt={`${selectedNPC.name}'s avatar`}
                  className="h-6 w-6 rounded-full object-cover"
                  width={24}
                  height={24}
                />
              )}
              {selectedNPC?.name || "Select NPC..."}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search NPCs..." />
            <CommandEmpty>No NPCs available.</CommandEmpty>
            <CommandGroup>
              {npcOptions?.map((npc) => {
                return (
                  <CommandItem
                    className="flex items-center gap-1"
                    key={npc.uid}
                    onSelect={() => {
                      setSelectedNPC(npc)
                      setOpen(false)
                      onSelectNpc(npc)
                    }}
                  >
                    {npc.imageUrl && (
                      <Image
                        src={npc.imageUrl}
                        alt={`${npc.name}'s avatar`}
                        className="mr-2 h-6 w-6 rounded-full object-cover"
                        width={24}
                        height={24}
                      />
                    )}
                    {npc.name}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
