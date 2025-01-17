import { NPC } from "@/data/types/NPC"
import { GameMessages } from "./GameMessages"
import { useMessageComposition } from "./hooks/useMessageComposition"
import Image from "next/image"
import { useContext } from "react"
import { GameInterfaceContext } from "./GameInterfaceContext"

export function NPCDisplay({ npc }: { npc: NPC }) {
  const { currentPlayer } = useContext(GameInterfaceContext)
  const {
    previousMessages,
    composingMessage,
    setComposingMessage,
    sendMessage,
  } = useMessageComposition({
    typesToShow: ["npc"],
    receiverId: npc.uid,
    senderId: currentPlayer?.uid,
    typeToSend: "npc",
  })

  return (
    <div className="flex min-h-0 flex-col gap-4">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-gray-100 p-4">
        {npc.imageUrl && (
          <Image
            src={npc.imageUrl}
            alt={npc.name}
            className="h-32 w-32 rounded-full object-cover"
            width={400}
            height={400}
          />
        )}
        <div>
          <h2 className="text-lg font-bold">{npc.name}</h2>
          {npc.personality && (
            <p className="italic text-gray-600">{npc.personality}</p>
          )}
        </div>
      </div>

      <GameMessages
        messages={previousMessages || []}
        composingMessage={composingMessage}
        updateComposingMessage={setComposingMessage}
        sendMessage={sendMessage}
      />
    </div>
  )
}
