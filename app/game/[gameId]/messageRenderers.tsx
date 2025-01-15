import { Message } from "@/data/types/Message"
import { idIsNpc } from "@/data/types/NPC"
import { ReactNode } from "react"

interface MessageRenderer {
  matches: (message: Message, currentPlayerId: string) => boolean
  render: (message: Message) => ReactNode
}

export const messageRenderers: MessageRenderer[] = [
  // Elder Council Messages
  {
    matches: (message) => message.type === "recap",
    render: (message) => (
      <div className="mb-2 rounded bg-purple-100 p-2 font-semibold">
        📝 {message.content}
      </div>
    ),
  },
  {
    matches: (message) => message.senderId === "elderCouncil",
    render: (message) => (
      <div className="mb-2 rounded bg-purple-100 p-2 font-semibold">
        🏛️ {message.content}
      </div>
    ),
  },

  // NPC Messages
  {
    matches: (message) => idIsNpc(message.senderId),
    render: (message) => (
      <div className="mb-2 rounded bg-yellow-50 p-2">🤖 {message.content}</div>
    ),
  },

  // Current Player Messages
  {
    matches: (message, currentPlayerId) => message.senderId === currentPlayerId,
    render: (message) => (
      <div className="mb-2 rounded bg-blue-50 p-2 text-right">
        {message.content} 💭
      </div>
    ),
  },

  // Other Player Messages
  {
    matches: (message, currentPlayerId) =>
      !idIsNpc(message.senderId) &&
      message.senderId !== currentPlayerId &&
      message.senderId !== "elderCouncil",
    render: (message) => (
      <div className="mb-2 rounded bg-gray-50 p-2">👤 {message.content}</div>
    ),
  },

  // Tile History Messages
  {
    matches: (message) => message.type === "tileHistory",
    render: (message) => (
      <div className="mb-2 rounded bg-gray-100 p-2 italic">
        📜 {message.content}
      </div>
    ),
  },

  // Current Player Tile Actions
  {
    matches: (message, currentPlayerId) =>
      message.type === "tileAction" && message.senderId === currentPlayerId,
    render: (message) => (
      <div className="mb-2 rounded bg-green-50 p-2 text-right">
        ⚡ {message.content}
      </div>
    ),
  },

  // Other Player Tile Actions
  {
    matches: (message, currentPlayerId) =>
      message.type === "tileAction" &&
      message.senderId !== currentPlayerId &&
      !idIsNpc(message.senderId),
    render: (message) => (
      <div className="mb-2 rounded bg-orange-50 p-2">
        👤⚡ {message.content}
      </div>
    ),
  },

  // NPC Tile Actions
  {
    matches: (message) =>
      message.type === "tileAction" && idIsNpc(message.senderId),
    render: (message) => (
      <div className="mb-2 rounded bg-red-50 p-2">🤖⚡ {message.content}</div>
    ),
  },
]
