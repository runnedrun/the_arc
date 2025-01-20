import {
  getSerializedMessages,
  getStringFromSerializedMessage,
} from "@/app/game/[gameId]/getSerializedMessages"
import { Message } from "@/data/types/Message"
import { GameProcessingArgs } from "../processGame/getGameData"

export const getMessageStrings = (
  messages: Message[],
  args: GameProcessingArgs,
  viewingUserId?: string
) => {
  const serializedMessages = getSerializedMessages(
    messages,
    args,
    viewingUserId
  )
  return serializedMessages.map((m, i) => getStringFromSerializedMessage(m, i))
}

export const getMessageStringsZipped = (
  messages: Message[],
  args: GameProcessingArgs,
  viewingUserId?: string
) => {
  const serializedMessages = getSerializedMessages(
    messages,
    args,
    viewingUserId
  )
  return serializedMessages.map((serializedMessage, i) => ({
    stringMessage: getStringFromSerializedMessage(serializedMessage, i),
    message: serializedMessage.originalMessage,
  }))
}
