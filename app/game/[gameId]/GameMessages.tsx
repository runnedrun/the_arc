import { Message } from "@/data/types/Message"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

interface GameMessagesProps {
  messages: Message[]
  composingMessage: Message
  updateComposingMessage: (messageContent: string) => void
}

export function GameMessages({
  messages,
  composingMessage,
  updateComposingMessage,
}: GameMessagesProps) {
  return (
    <div className="flex flex-col gap-2">
      <ScrollArea className="h-40">
        {messages.map((message) => (
          <div
            key={message.uid}
            className={`mb-2 rounded-lg p-2 ${
              message.processedAt ? "bg-gray-100" : "bg-yellow-50"
            }`}
          >
            {message.content}
          </div>
        ))}
      </ScrollArea>
      <Textarea
        value={composingMessage?.content || ""}
        onChange={(e) => updateComposingMessage(e.target.value)}
        placeholder="Type your message..."
        className="min-h-[100px]"
      />
    </div>
  )
}
