import { Message } from "@/data/types/Message"

export const isConversationalMessage = (message: Message) =>
  message.type === "npc" || message.type === "elderCouncil"
