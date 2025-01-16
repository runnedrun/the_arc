import { Message } from "@/data/types/Message"
import { idIsNpc } from "@/data/types/NPC"
import { ReactNode, FC, useContext } from "react"
import { GameInterfaceContext } from "./GameInterfaceContext"

interface MessageRenderer {
  matches: (message: Message, currentPlayerId: string) => boolean
  RenderComponent: FC<{ message: Message }>
}

export const SenderNameWrapper = ({
  message,
  children,
}: React.PropsWithChildren<{ message: Message }>) => {
  const { currentPlayer, npcs } = useContext(GameInterfaceContext)

  const player = npcs.find((n) => n.uid === message.senderId) || currentPlayer
  let senderName = player?.name || "Elder Council"

  if (message.type === "tileHistory") {
    senderName = "Historian"
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="font-semibold">{senderName}</div>
      {children}
    </div>
  )
}

export const messageRenderers: MessageRenderer[] = [
  // Elder Council Messages
  {
    matches: (message) => message.type === "recap",
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message}>
        <div className="mb-2 rounded bg-purple-100 p-2 font-semibold">
          📝 {message.content}
        </div>
      </SenderNameWrapper>
    ),
  },
  {
    matches: (message) => message.senderId === "elderCouncil",
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message}>
        <div className="mb-2 rounded bg-purple-100 p-2 font-semibold">
          🏛️ {message.content}
        </div>
      </SenderNameWrapper>
    ),
  },

  // NPC Messages
  {
    matches: (message) => idIsNpc(message.senderId),
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message}>
        <div className="mb-2 rounded bg-yellow-50 p-2">
          🤖 {message.content}
        </div>
      </SenderNameWrapper>
    ),
  },

  // Current Player Messages
  {
    matches: (message, currentPlayerId) => message.senderId === currentPlayerId,
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message}>
        <div className="mb-2 rounded bg-blue-50 p-2 text-right">
          {message.content} 💭
        </div>
      </SenderNameWrapper>
    ),
  },

  // Other Player Messages
  {
    matches: (message, currentPlayerId) =>
      !idIsNpc(message.senderId) &&
      message.senderId !== currentPlayerId &&
      message.senderId !== "elderCouncil",
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message}>
        <div className="mb-2 rounded bg-gray-50 p-2">👤 {message.content}</div>
      </SenderNameWrapper>
    ),
  },

  // Tile History Messages
  {
    matches: (message) => message.type === "tileHistory",
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message}>
        <div className="mb-2 rounded bg-gray-100 p-2 italic">
          📜 {message.content}
        </div>
      </SenderNameWrapper>
    ),
  },

  // Current Player Tile Actions
  {
    matches: (message, currentPlayerId) =>
      message.type === "tileAction" && message.senderId === currentPlayerId,
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message}>
        <div className="mb-2 rounded bg-green-50 p-2 text-right">
          ⚡ {message.content}
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
      <SenderNameWrapper message={message}>
        <div className="mb-2 rounded bg-orange-50 p-2">
          👤⚡ {message.content}
        </div>
      </SenderNameWrapper>
    ),
  },

  // NPC Tile Actions
  {
    matches: (message) =>
      message.type === "tileAction" && idIsNpc(message.senderId),
    RenderComponent: ({ message }) => (
      <SenderNameWrapper message={message}>
        <div className="mb-2 rounded bg-red-50 p-2">🤖⚡ {message.content}</div>
      </SenderNameWrapper>
    ),
  },
]
