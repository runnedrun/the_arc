import { Message } from "@/data/types/Message"
import { idIsNpc } from "@/data/types/NPC"
import { ReactNode, FC, useContext } from "react"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { cn } from "@/lib/utils"

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

const isConversationalMessage = (message: Message) =>
  message.type === "npc" || message.type === "elderCouncil"

export const messageRenderers: MessageRenderer[] = [
  // Elder Council Messages
  {
    matches: (message) => message.type === "recap",
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message} icon="📝">
        <div className="mb-2 rounded bg-purple-100 p-2 font-semibold">
          {message.content}
        </div>
      </SenderNameWrapper>
    ),
  },
  {
    matches: (message) => message.type === "councilDecree",
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message} icon="🏛️">
        <div className="mb-2 rounded bg-purple-100 p-2 font-semibold">
          {message.content}
        </div>
      </SenderNameWrapper>
    ),
  },

  {
    matches: (message) =>
      isConversationalMessage(message) && message.senderId === "elderCouncil",
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message} icon="🏛️💭 ">
        <div className="mb-2 rounded bg-purple-100 p-2 font-semibold">
          {message.content}
        </div>
      </SenderNameWrapper>
    ),
  },

  // NPC Messages
  {
    matches: (message) =>
      isConversationalMessage(message) && idIsNpc(message.senderId),
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message} icon="🤖">
        <div className="mb-2 rounded bg-yellow-50 p-2">{message.content}</div>
      </SenderNameWrapper>
    ),
  },

  // Current Player Messages
  {
    matches: (message, currentPlayerId) =>
      isConversationalMessage(message) && message.senderId === currentPlayerId,
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message} icon="💭">
        <div className="mb-2 rounded bg-blue-50 p-2 text-right">
          {message.content}
        </div>
      </SenderNameWrapper>
    ),
  },

  // Other Player Messages
  {
    matches: (message, currentPlayerId) =>
      isConversationalMessage(message) &&
      !idIsNpc(message.senderId) &&
      message.senderId !== currentPlayerId &&
      message.senderId !== "elderCouncil",
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message} icon="👤">
        <div className="mb-2 rounded bg-gray-50 p-2">{message.content}</div>
      </SenderNameWrapper>
    ),
  },

  // Tile History Messages
  {
    matches: (message) => message.type === "tileHistory",
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message} icon="📜">
        <div className="mb-2 rounded bg-gray-100 p-2 italic">
          {message.content}
        </div>
      </SenderNameWrapper>
    ),
  },

  // Current Player Tile Actions
  {
    matches: (message, currentPlayerId) =>
      message.type === "tileAction" && message.senderId === currentPlayerId,
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message} icon="⚡">
        <div className="mb-2 rounded bg-green-50 p-2 text-right">
          {message.content}
        </div>
      </SenderNameWrapper>
    ),
  },

  // Other Player Tile Actions
  {
    matches: (message, currentPlayerId) =>
      message.type === "tileAction" &&
      message.senderId !== currentPlayerId &&
      !idIsNpc(message.senderId),
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message} icon="👤⚡">
        <div className="mb-2 rounded bg-orange-50 p-2">{message.content}</div>
      </SenderNameWrapper>
    ),
  },

  // NPC Tile Actions
  {
    matches: (message) =>
      message.type === "tileAction" && idIsNpc(message.senderId),
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message} icon="🤖⚡">
        <div className="mb-2 rounded bg-red-50 p-2">{message.content}</div>
      </SenderNameWrapper>
    ),
  },

  {
    matches: (message) =>
      message.type === "tileAction" && message.senderId === "elderCouncil",
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message} icon="🏛️⚡">
        <div className="mb-2 rounded bg-red-50 p-2">{message.content}</div>
      </SenderNameWrapper>
    ),
  },

  // tile movement
  {
    matches: (message) =>
      message.type === "tileMovement" && idIsNpc(message.senderId),
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message} icon="🤖🚶‍♂️">
        <div className="mb-2 rounded bg-red-50 p-2">{message.content}</div>
      </SenderNameWrapper>
    ),
  },
  {
    matches: (message) =>
      message.type === "tileMovement" && !idIsNpc(message.senderId),
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message} icon="🚶‍♂️">
        <div className="mb-2 rounded bg-red-50 p-2">{message.content}</div>
      </SenderNameWrapper>
    ),
  },
]
