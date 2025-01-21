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
import { queryObs } from "@/data/readerFe"
import { NPC } from "@/data/types/NPC"
import { useObs } from "@/data/useObs"
import { cn } from "@/lib/utils"
import { CommandItem } from "cmdk"
import { limit } from "firebase/firestore"
import { Check, ChevronsUpDown } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import { combineLatest } from "rxjs"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { NPCDisplay } from "./NPCDisplay"
import { useTileInfoDisplay } from "./TileInfoDisplayContext"

type NPCsWithPendingMessageBool = NPC & {
  hasPendingMessages: boolean
}

export const useNPCsHaveMessagesForThisRound = (npcs: NPC[]) => {
  const { currentRound, currentPlayer } = useContext(GameInterfaceContext)
  const obs = npcs.map((npc) => {
    return queryObs("messages", ({ where }) => {
      return [
        where("roundId", "==", currentRound?.uid || "__never__"),
        where("senderId", "==", currentPlayer?.uid || "__never__"),
        where("receiverId", "==", npc.uid),
        limit(1),
      ]
    })
  })

  const combinedObs = combineLatest(obs)
  const messagesForNpcs =
    useObs(combinedObs, [currentRound?.uid, currentPlayer?.uid]) || []

  return npcs.map((npc, i) => {
    const messages = messagesForNpcs[i] || []
    const messagesWithContent = messages.filter((_) => !!_.content)
    return {
      ...npc,
      hasPendingMessages: !!messagesWithContent?.length,
    } as NPCsWithPendingMessageBool
  })
}

export function NPCSelector({ npcOptions }: { npcOptions: NPC[] }) {
  const [open, setOpen] = useState(false)
  const { selectedNPC, setSelectedNPC } = useTileInfoDisplay()
  const npcsWithPendingMessages = useNPCsHaveMessagesForThisRound(npcOptions)

  useEffect(() => {
    if (npcsWithPendingMessages?.length && !selectedNPC) {
      setSelectedNPC(npcsWithPendingMessages[0])
    }
  }, [npcsWithPendingMessages, selectedNPC, setSelectedNPC])

  return (
    <div className="flex max-h-[600px] flex-col gap-4 overflow-hidden">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {selectedNPC?.name || "Select NPC..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search NPCs..." />
            <CommandEmpty>No NPCs available.</CommandEmpty>
            <CommandGroup>
              {npcsWithPendingMessages?.map((npc) => {
                return (
                  <CommandItem
                    className="flex items-center gap-1"
                    key={npc.uid}
                    onSelect={() => {
                      setSelectedNPC(npc)
                      setOpen(false)
                    }}
                  >
                    {npc.hasPendingMessages && (
                      <Check className={cn("mr-2 h-4 w-4")} />
                    )}
                    {npc.name}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedNPC && <NPCDisplay npc={selectedNPC} />}
    </div>
  )
}
