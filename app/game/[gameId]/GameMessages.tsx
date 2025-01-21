import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Message } from "@/data/types/Message"
import { useContext, useEffect, useRef } from "react"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { TokenCountContext } from "./TokenCountContext"
import { SerializedMessageDisplay } from "./SerializedMessageDisplay"
import { getSerializedMessage } from "./getSerializedMessages"
import { useTileInfoDisplay } from "./TileInfoDisplayContext"
import { isEqual } from "lodash-es"

interface GameMessagesProps {
  messages: Message[]
  composingMessage: Message
  updateComposingMessage: (messageContent: string) => void
  sendMessage: () => void
  scrollAreaClassName?: string
  allowClicking?: boolean
}

function MessageDisplay({
  message,
  allowClicking = false,
}: {
  message: Message
  allowClicking?: boolean
}) {
  const { currentPlayer, npcs, players } = useContext(GameInterfaceContext)

  const { setSelectedTab, setSelectedNPC, openTile } = useTileInfoDisplay()

  // Show typing indicator if message is processing but has no content
  if (
    !message.content &&
    message.processingTriggeredAt &&
    !message.processedAt
  ) {
    return (
      <div className="flex items-center space-x-2 p-2">
        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 delay-100" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 delay-200" />
      </div>
    )
  }

  message.type === "tileAction" && console.log("messageddd", message)

  const serializedMessage = getSerializedMessage(
    message,
    {
      players,
      npcs,
    },
    currentPlayer?.uid
  )

  const npcsOnCurrentTile = npcs.filter((npc) =>
    isEqual(openTile?.position, npc.currentTileLocation)
  )

  const npcForMessage = npcsOnCurrentTile.find(
    (npc) => npc.uid === message.senderId
  )

  const handleClick =
    npcForMessage && allowClicking
      ? () => {
          setSelectedNPC(npcForMessage)
          setSelectedTab("npcs")
        }
      : undefined

  return (
    <SerializedMessageDisplay
      message={serializedMessage}
      onNameClick={handleClick}
    />
  )
}

export function GameMessages({
  messages,
  composingMessage,
  updateComposingMessage,
  sendMessage,
  allowClicking = false,
}: GameMessagesProps) {
  const { charactersRemaining, charactersAvailable, charactersUsedThisRound } =
    useContext(TokenCountContext)
  const { playerHasEndedRound } = useContext(GameInterfaceContext)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // allow the mesage to render before scroling
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }, [messages?.[0]?.uid])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex min-h-0 grow flex-col gap-2">
      <ScrollArea className="flex min-h-0 grow flex-col">
        <div className="flex flex-col-reverse">
          {messages.length ? (
            <>
              <div ref={messagesEndRef} />
              {messages.map((message) => (
                <MessageDisplay
                  key={message.uid}
                  message={message}
                  allowClicking={allowClicking}
                />
              ))}
            </>
          ) : (
            <div>No messages yet</div>
          )}
        </div>
      </ScrollArea>
      {sendMessage && (
        <div className="flex-shrink-0 space-y-1">
          <Textarea
            disabled={playerHasEndedRound}
            value={composingMessage?.content || ""}
            onChange={(e) => {
              const oldMessageLength = composingMessage?.content?.length || 0
              const newMessageLength = e.target.value.length
              const newCharactersUsed = newMessageLength - oldMessageLength

              if (
                charactersUsedThisRound + newCharactersUsed >
                charactersAvailable
              ) {
                return
              }
              updateComposingMessage(e.target.value)
            }}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className={`min-h-[100px] ${charactersRemaining <= 0 ? "border-red-500" : ""}`}
          />
          {charactersRemaining <= 0 && (
            <p className="text-sm text-red-500">
              You have reached the maximum character limit
            </p>
          )}
        </div>
      )}
    </div>
  )
}
