import { Message } from "@/data/types/Message"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useContext } from "react"
import { TokenCountContext } from "./TokenCountContext"
import { GameInterfaceContext } from "./GameInterfaceContext"

interface GameMessagesProps {
  messages: Message[]
  composingMessage: Message
  updateComposingMessage: (messageContent: string) => void
  allowComposing?: Boolean
}

export function GameMessages({
  messages,
  composingMessage,
  updateComposingMessage,
  allowComposing = true,
}: GameMessagesProps) {
  const { charactersRemaining } = useContext(TokenCountContext)
  const { playerHasEndedRound } = useContext(GameInterfaceContext)

  return (
    <div className="flex flex-col gap-2">
      <ScrollArea className="h-40">
        {messages.length ? (
          messages.map((message) => {
            const isHistoryType = message.type === "tileHistory"

            return (
              <div
                key={message.uid}
                className={`mb-2 rounded p-2 ${
                  isHistoryType ? "bg-gray-100 italic" : "bg-white"
                }`}
              >
                {message.content}
              </div>
            )
          })
        ) : (
          <div>No messages yet</div>
        )}
      </ScrollArea>
      {allowComposing && (
        <Textarea
          disabled={charactersRemaining <= 0 || playerHasEndedRound}
          value={composingMessage?.content || ""}
          onChange={(e) => updateComposingMessage(e.target.value)}
          placeholder="Type your message..."
          className="min-h-[100px]"
        />
      )}
    </div>
  )
}
