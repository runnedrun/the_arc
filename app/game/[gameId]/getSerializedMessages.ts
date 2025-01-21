import { Message } from "@/data/types/Message"
import { GameProcessingArgs } from "@/functions/src/triggers/processGame/getGameData"
import { idIsNpc, NPC } from "@/data/types/NPC"
import { isConversationalMessage } from "./isConversationalMessage"
import { sortBy } from "lodash-es"
import { Player } from "@/data/types/Player"

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

interface MinimalGameArgs {
  players: Player[]
  npcs: NPC[]
}

interface GetSerializedMessagesOpts {
  currentPlayerId?: string
  usePlayerIndexes?: boolean
}

const getMessageConfig = (
  message: Message,
  gameArgs: MinimalGameArgs,
  opts: GetSerializedMessagesOpts = {}
): SerializedMessage => {
  const playersSorted = sortBy(gameArgs.players, "uid")
  const npcsSorted = sortBy(gameArgs.npcs, "uid")
  const getCharacterName = (uid: string) => {
    if (opts.usePlayerIndexes) {
      const playerIndex = playersSorted.findIndex((p) => p.uid === uid)
      const npcIndex = npcsSorted.findIndex((n) => n.uid === uid)
      if (playerIndex !== -1) {
        return `Player ${playerIndex + 1}`
      } else if (npcIndex !== -1) {
        return `NPC ${npcIndex + 1}`
      } else {
        return "Unknown"
      }
    } else {
      const player = gameArgs.players.find((p) => p.uid === uid)
      const npc = gameArgs.npcs.find((n) => n.uid === uid)
      return player?.name || npc?.name || "Unknown"
    }
  }

  const isCurrentUser = message.senderId === opts.currentPlayerId

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
    secretObjective: {
      icon: "🤫",
      senderName: `Secret Objective for ${getCharacterName(message.receiverId)}`,
      bgColor: "bg-indigo-100",
    },
    publicObjective: {
      icon: "🎯",
      senderName: "Public Objective",
      bgColor: "bg-amber-100",
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
    senderName: config.senderName || getCharacterName(message.senderId),
    content: message.content || "",
    icon: config.icon || "💬",
    originalMessage: message,
    isCurrentUser,
    bgColor: config.bgColor || "bg-white",
    align: config.align || (isCurrentUser ? "right" : "left"),
  }
}

export const getSerializedMessage = (
  message: Message,
  gameArgs: MinimalGameArgs,
  opts: GetSerializedMessagesOpts
) => {
  return getMessageConfig(message, gameArgs, opts)
}

export const getSerializedMessages = (
  messages: Message[],
  gameArgs: MinimalGameArgs,
  opts: GetSerializedMessagesOpts
) => {
  return messages.map((message) => getMessageConfig(message, gameArgs, opts))
}
