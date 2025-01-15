import { Message } from "@/data/types/Message"
import { GameProcessingArgs } from "../processGame/getGameData"
import { getNpcId, idIsNpc } from "@/data/types/NPC"

interface MessagePrefixCreator {
  applies: (message: Message) => boolean
  getPrefix: () => string
}

export const MessagePrefixes: MessagePrefixCreator[] = [
  {
    applies: (message) => message.type === "tileHistory",
    getPrefix: () => "Results of previous actions",
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
  players: GameProcessingArgs["players"]
) => {
  return messages.map((message) => {
    const player = players.find((p) => p.uid === message.senderId)

    const prefix =
      MessagePrefixes.find((p) => p.applies(message))?.getPrefix() || ""

    const playerPrefix = player ? `by ${player.name}` : ""

    const yearPrefix =
      message.roundIndex !== undefined ? `Year ${message.roundIndex}` : ""
    return `${yearPrefix}${yearPrefix ? " - " : ""}${prefix} ${playerPrefix}: ${message.content}`
  })
}
