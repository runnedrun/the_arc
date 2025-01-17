import { Message } from "@/data/types/Message"
import { GameProcessingArgs } from "../processGame/getGameData"
import { sortBy } from "lodash-es"
import { idIsNpc } from "@/data/types/NPC"

interface MessagePrefixCreator {
  applies: (message: Message, viewingUserId: string) => boolean
  getPrefix: (message: Message, gameArgs: GameProcessingArgs) => string
}

const getSenderName = (message: Message, gameArgs: GameProcessingArgs) => {
  const player = gameArgs.players.find((p) => p.uid === message.senderId)
  const npc = gameArgs.npcs.find((n) => n.uid === message.senderId)
  return player ? player.name : npc?.name || "Player"
}

export const MessagePrefixes: MessagePrefixCreator[] = [
  {
    applies: (message, viewingUserId) =>
      viewingUserId && message.senderId === viewingUserId,
    getPrefix: () => "Message from you",
  },
  {
    applies: (message) => message.type === "npc" && !idIsNpc(message.senderId),
    getPrefix: (message, gameArgs) =>
      `Message from ${getSenderName(message, gameArgs)}`,
  },
  {
    applies: (message) => message.type === "tileHistory",
    getPrefix: () => "Update from tile historian:",
  },
  {
    applies: (message) => message.type === "councilDecree",
    getPrefix: () => "Elder Council decree",
  },
  {
    applies: (message) =>
      message.senderId !== "elderCouncil" && message.type === "elderCouncil",
    getPrefix: (message, gameArgs) =>
      `Message to Elder Council from ${getSenderName(message, gameArgs)}`,
  },
  {
    applies: (message) =>
      message.senderId === "elderCouncil" && message.type === "tileAction",
    getPrefix: () => "Elder Council action",
  },
  {
    applies: (message) =>
      message.senderId !== "elderCouncil" && message.type === "tileAction",
    getPrefix: (message, gameArgs) =>
      `Action by ${getSenderName(message, gameArgs)}`,
  },
  {
    applies: (message) => message.type === "recap",
    getPrefix: () => "Annual recap by historian",
  },
]

export const getMessageStrings = (
  messages: Message[],
  args: GameProcessingArgs,
  viewingUserId?: string
) => {
  return getMessageStringsZipped(messages, args, viewingUserId).map(
    (m) => m.stringMessage
  )
}

export const getMessageStringsZipped = (
  messages: Message[],
  args: GameProcessingArgs,
  viewingUserId?: string
) => {
  const messagesWithIndex = sortBy(messages, (_) => _.createdAt.toMillis()).map(
    (message, i) => ({
      ...message,
      index: i,
    })
  )

  return messagesWithIndex.map((message) => {
    const prefix =
      MessagePrefixes.find((p) => p.applies(message, viewingUserId))?.getPrefix(
        message,
        args
      ) || ""

    const yearPrefix =
      message.roundIndex !== undefined ? `Year ${message.roundIndex}` : ""
    return {
      stringMessage: `Event ${message.index + 1} - ${yearPrefix}${yearPrefix ? " - " : ""}${prefix}: ${message.content}`,
      message,
    }
  })
}
