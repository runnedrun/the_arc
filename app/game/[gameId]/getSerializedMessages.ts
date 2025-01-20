import { Message } from "@/data/types/Message"
import { GameProcessingArgs } from "@/functions/src/triggers/processGame/getGameData"
import { idIsNpc } from "@/data/types/NPC"
import { isConversationalMessage } from "./isConversationalMessage"
import { sortBy } from "lodash-es"

export interface SerializedMessage {
  senderId?: string
  senderName: string
  content: string
  icon: string
  originalMessage: Message
  isCurrentUser?: boolean
  bgColor: string
  align?: "left" | "right"
}

const getMessageConfig = (
  message: Message,
  currentPlayerId?: string,
  gameArgs?: GameProcessingArgs
): SerializedMessage => {
  const getSenderName = () => {
    if (gameArgs) {
      const player = gameArgs.players.find((p) => p.uid === message.senderId)
      const npc = gameArgs.npcs.find((n) => n.uid === message.senderId)
      return player?.name || npc?.name || "Unknown"
    }
    return message.senderId === "elderCouncil" ? "Elder Council" : "Unknown"
  }

  const isCurrentUser = message.senderId === currentPlayerId

  // Base configurations for different message types
  const configs: Record<string, Partial<SerializedMessage>> = {
    recap: {
      icon: "📝",
      senderName: "Elder Council",
      bgColor: "bg-purple-100",
    },
    councilDecree: {
      icon: "🏛️",
      senderName: "Elder Council",
      bgColor: "bg-purple-100",
    },
    tileHistory: {
      icon: "📜",
      senderName: "Historian",
      bgColor: "bg-gray-100",
    },
    tileAction: {
      icon: isCurrentUser ? "⚡" : idIsNpc(message.senderId) ? "🤖⚡" : "👤⚡",
      bgColor: isCurrentUser ? "bg-green-50" : "bg-orange-50",
    },
    tileMovement: {
      icon: idIsNpc(message.senderId) ? "🤖🚶‍♂️" : "🚶‍♂️",
      bgColor: "bg-red-50",
    },
  }

  // Handle conversational messages
  if (isConversationalMessage(message)) {
    if (message.senderId === "elderCouncil") {
      configs.conversational = {
        icon: "🏛️💭",
        senderName: "Elder Council",
        bgColor: "bg-purple-100",
      }
    } else if (idIsNpc(message.senderId)) {
      configs.conversational = {
        icon: "🤖",
        bgColor: "bg-yellow-50",
      }
    } else if (isCurrentUser) {
      configs.conversational = {
        icon: "💭",
        bgColor: "bg-blue-50",
        align: "right",
      }
    } else {
      configs.conversational = {
        icon: "👤",
        bgColor: "bg-gray-50",
      }
    }
  }

  const config = configs[message.type] || configs.conversational || {}

  return {
    senderId: message.senderId,
    senderName: config.senderName || getSenderName(),
    content: message.content || "",
    icon: config.icon || "💬",
    originalMessage: message,
    isCurrentUser,
    bgColor: config.bgColor || "bg-white",
    align: config.align || (isCurrentUser ? "right" : "left"),
  }
}

export const getSerializedMessages = (
  messages: Message[],
  gameArgs: GameProcessingArgs,
  currentPlayerId?: string
) => {
  return sortBy(messages, (m) => m.createdAt.toMillis()).map((message) =>
    getMessageConfig(message, currentPlayerId, gameArgs)
  )
}

export const getStringFromSerializedMessage = (
  serializedMessage: SerializedMessage,
  index: number,
  includeYear = true
) => {
  const yearPrefix =
    includeYear && serializedMessage.originalMessage.roundIndex !== undefined
      ? `Year ${serializedMessage.originalMessage.roundIndex}`
      : ""

  const prefix = `${serializedMessage.senderName}`

  return `Event ${index + 1}${yearPrefix ? ` - ${yearPrefix}` : ""} - ${prefix}: ${
    serializedMessage.content
  }`
}
