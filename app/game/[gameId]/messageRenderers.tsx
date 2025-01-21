import { Message } from "@/data/types/Message"
import { idIsNpc } from "@/data/types/NPC"
import { ReactNode, FC, useContext } from "react"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { cn } from "@/lib/utils"
import { isConversationalMessage } from "./isConversationalMessage"

interface MessageRenderer {
  matches: (message: Message, currentPlayerId: string) => boolean
  RenderComponent: FC<{ message: Message }>
}

export const SenderNameWrapper = ({
  message,
  icon,
  children,
}: React.PropsWithChildren<{ message: Message; icon?: string }>) => {
  const { currentPlayer, npcs } = useContext(GameInterfaceContext)

  if (message.type === "tileHistory") console.log("message", message)

  let senderName = currentPlayer?.name || "Elder Council"

  if (idIsNpc(message.senderId)) {
    const npc = npcs.find((n) => n.uid === message.senderId)
    senderName = npc?.name
  } else if (message.type === "tileHistory") {
    senderName = "Historian"
  } else if (message.senderId === "elderCouncil" || message.type === "recap") {
    senderName = "Elder Council"
  }

  const isCurrentPlayer = message.senderId === currentPlayer?.uid

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "flex w-full items-center gap-2",
          isCurrentPlayer && "justify-end"
        )}
      >
        <div className="text-2xl">{icon}</div>
        <div className="font-semibold">{senderName}</div>
      </div>
      {children}
    </div>
  )
}
