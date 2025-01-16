import { Message } from "@/data/types/Message"
import { GameProcessingArgs } from "../processGame/getGameData"
import { sortBy } from "lodash-es"
import { idIsNpc } from "@/data/types/NPC"

interface MessagePrefixCreator {
  applies: (message: Message, viewingUserId: string) => boolean
  getPrefix: () => string
}

export const MessagePrefixes: MessagePrefixCreator[] = [
  {
    applies: (message, viewingUserId) =>
      viewingUserId && message.senderId === viewingUserId,
    getPrefix: () => "Message from you",
  },
  {
    applies: (message) => message.type === "npc" && !idIsNpc(message.senderId),
    getPrefix: () => "Message from player",
  },
  {
    applies: (message) => message.type === "tileHistory",
    getPrefix: () => "Update from tile historian:",
  },
  {
    applies: (message) =>
      message.senderId === "elderCouncil" && message.type === "elderCouncil",
    getPrefix: () => "Elder Council decree",
  },
  {
    applies: (message) =>
      message.senderId !== "elderCouncil" && message.type === "elderCouncil",
    getPrefix: () => "Elder Council request",
  },
  {
    applies: (message) =>
      message.senderId === "elderCouncil" && message.type === "tileAction",
    getPrefix: () => "Elder Council action",
  },
  {
    applies: (message) =>
      message.senderId !== "elderCouncil" && message.type === "tileAction",
    getPrefix: () => "Action",
  },
  {
    applies: (message) => message.type === "recap",
    getPrefix: () => "Recap",
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
    const player = args.players.find((p) => p.uid === message.senderId)
    const npc = args.npcs.find((n) => n.uid === message.senderId)
    const sender = player || npc

    const prefix =
      MessagePrefixes.find((p) =>
        p.applies(message, viewingUserId)
      )?.getPrefix() || ""

    const senderPrefix = sender ? `by ${sender.name}` : ""

    const yearPrefix =
      message.roundIndex !== undefined ? `Year ${message.roundIndex}` : ""
    return {
      stringMessage: `Event ${message.index + 1} - ${yearPrefix}${yearPrefix ? " - " : ""}${prefix} ${senderPrefix}: ${message.content}`,
      message,
    }
  })
}
