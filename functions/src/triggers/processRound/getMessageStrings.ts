import {
  getSerializedMessages,
  GetSerializedMessagesOpts,
  SerializedMessage,
} from "@/app/game/[gameId]/getSerializedMessages"
import { Message } from "@/data/types/Message"
import { GameProcessingArgs } from "../processGame/getGameData"
import { sortBy } from "lodash-es"

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

const sortAndFilterMessages = (messages: Message[]) => {
  return sortBy(messages, (m) => m.createdAt.toMillis()).filter(
    (m) => !!m.content
  )
}

export const getMessageStrings = (
  messages: Message[],
  args: GameProcessingArgs,
  opts: GetSerializedMessagesOpts = {}
) => {
  const serializedMessages = getSerializedMessages(
    sortAndFilterMessages(messages),
    args,
    opts
  )
  const messageStrings = serializedMessages.map((m, i) =>
    getStringFromSerializedMessage(m, i)
  )
  return messageStrings.length > 0
    ? messageStrings.join("\n")
    : opts.emptyMessage || ""
}

export const getMessageStringsZipped = (
  messages: Message[],
  args: GameProcessingArgs,
  opts: GetSerializedMessagesOpts = {}
) => {
  const serializedMessages = getSerializedMessages(
    sortAndFilterMessages(messages),
    args,
    opts
  )
  return serializedMessages.map((serializedMessage, i) => ({
    stringMessage: getStringFromSerializedMessage(serializedMessage, i),
    message: serializedMessage.originalMessage,
  }))
}
