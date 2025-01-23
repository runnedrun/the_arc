import { Message } from "@/data/types/Message"
import { GameProcessingArgs } from "@/functions/src/triggers/processGame/getGameData"
import { idIsNpc, NPC } from "@/data/types/NPC"
import { isConversationalMessage } from "./isConversationalMessage"
import { sortBy } from "lodash-es"
import { Player } from "@/data/types/Player"
import { isServerside } from "@/helpers/isServerside"

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
  allPlayersIncludingArchived: Player[]
  npcs: NPC[]
}

export interface GetSerializedMessagesOpts {
  currentPlayerId?: string
  emptyMessage?: string
}

export const getCharacterName = (args: MinimalGameArgs, uid: string) => {
  const playersSorted = sortBy(
    args.allPlayersIncludingArchived,
    (_) => _.createdAt
  )
  const npcsSorted = sortBy(args.npcs, (_) => _.createdAt)

  const playerIndex = playersSorted.findIndex((p) => p.uid === uid)
  const npcIndex = npcsSorted.findIndex((n) => n.uid === uid)

  let playerIndexString = ""

  if (isServerside()) {
    if (playerIndex !== -1) {
      playerIndexString = `Player ${playerIndex + 1}`
    } else if (npcIndex !== -1) {
      playerIndexString = `NPC ${npcIndex + 1}`
    }
  }

  let playerNameString = ""

  const player = playersSorted.find((p) => p.uid === uid)
  const npc = npcsSorted.find((n) => n.uid === uid)
  playerNameString = player?.name || npc?.name || "Unknown"

  return playerIndexString
    ? `${playerIndexString} (${playerNameString})`
    : playerNameString
}

const getMessageConfig = (
  message: Message,
  gameArgs: MinimalGameArgs,
  opts: GetSerializedMessagesOpts = {}
): SerializedMessage => {
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
      senderName: `Secret Objective for ${getCharacterName(
        gameArgs,
        message.receiverId
      )}`,
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
    senderName:
      config.senderName || getCharacterName(gameArgs, message.senderId),
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
