import { NPC } from "@/data/types/NPC"
import { GameMessages } from "./GameMessages"
import { useMessageComposition } from "./hooks/useMessageComposition"

export function NPCDisplay({ npc }: { npc: NPC }) {
  const { previousMessages, composingMessage, setComposingMessage } =
    useMessageComposition({
      type: "npc",
      receiverId: npc.uid,
    })

  return (
    <GameMessages
      messages={previousMessages || []}
      composingMessage={composingMessage}
      updateComposingMessage={setComposingMessage}
    />
  )
}
