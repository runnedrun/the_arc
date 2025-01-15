import { Message } from "@/data/types/Message"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useContext } from "react"
import { TokenCountContext } from "./TokenCountContext"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { messageRenderers } from "./messageRenderers"

interface GameMessagesProps {
  messages: Message[]
  composingMessage: Message
  updateComposingMessage: (messageContent: string) => void
  allowComposing?: Boolean
  scrollAreaClassName?: string
}

export function GameMessages({
  messages,
  composingMessage,
  updateComposingMessage,
  allowComposing = true,
  scrollAreaClassName = "h-40",
}: GameMessagesProps) {
  const { charactersRemaining } = useContext(TokenCountContext)
  const { playerHasEndedRound, currentPlayer } =
    useContext(GameInterfaceContext)

  return (
    <div className="flex flex-col gap-2">
      <ScrollArea className={scrollAreaClassName}>
        <div className="flex flex-col-reverse">
          {messages.length ? (
            messages.map((message) => {
              const renderer = messageRenderers.find((r) =>
                r.matches(message, currentPlayer?.uid)
              )
              return renderer ? (
                <div key={message.uid}>{renderer.render(message)}</div>
              ) : (
                <div key={message.uid} className="mb-2 rounded bg-white p-2">
                  {message.content}
                </div>
              )
            })
          ) : (
            <div>No messages yet</div>
          )}
        </div>
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
