import { NPC } from "@/data/types/NPC"
import { isEqual } from "lodash-es"
import { useContext } from "react"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { GameMessages } from "./GameMessages"
import { useMessageComposition } from "./hooks/useMessageComposition"

export function NPCDisplay({ npc }: { npc: NPC }) {
  const { currentPlayer } = useContext(GameInterfaceContext)
  const playerIsOnTileWithNpc = isEqual(
    currentPlayer?.currentTileLocation,
    npc.currentTileLocation
  )
  const {
    messages: previousMessages,
    composingMessage,
    setComposingMessage,
    sendMessage,
  } = useMessageComposition({
    typesToShow: ["npc"],
    receiverId: npc.uid,
    senderId: currentPlayer?.uid,
    typeToSend: "npc",
    viewingPlayerId: currentPlayer?.uid,
  })

  return (
    <div className="flex min-h-0 grow flex-col gap-4">
      <GameMessages
        messages={previousMessages || []}
        composingMessage={composingMessage}
        updateComposingMessage={setComposingMessage}
        sendMessage={playerIsOnTileWithNpc ? sendMessage : undefined}
      />
    </div>
  )
}
