import { useContext, useCallback } from "react"
import { fbSet, genExtraData } from "@/data/writerFe"
import { Message } from "@/data/types/Message"
import { v4 as uuidv4 } from "uuid"
import { useObs } from "@/data/useObs"
import {
  OrObservable,
  PossibleQueryConstraint,
  queryObs,
} from "@/data/readerFe"
import { GameInterfaceContext } from "../GameInterfaceContext"
import { MapPosition } from "@/data/types/MapTile"
import { Timestamp } from "firebase/firestore"
import { ProcessMessageArgs } from "@/app/api/process_message/route"

interface MessageCompositionOptions {
  typesToShow: Message["type"][]
  typeToSend?: Message["type"]
  receiverId?: string
  tileLocation?: MapPosition
  senderId?: string
}

export function useMessageComposition({
  typesToShow,
  typeToSend,
  receiverId,
  tileLocation,
  senderId,
}: MessageCompositionOptions) {
  const { game, currentRound } = useContext(GameInterfaceContext)

  const allMessages =
    useObs(
      queryObs("messages", ({ where, orderBy, or }) => {
        const conditions = [
          where("gameId", "==", game?.uid),
        ] as OrObservable<PossibleQueryConstraint>[]

        conditions.push(where("type", "in", typesToShow))

        if (receiverId) {
          conditions.push(
            or(
              where("receiverId", "==", receiverId),
              where("senderId", "==", receiverId)
            )
          )
        }

        if (tileLocation) {
          conditions.push(where("tileLocation.x", "==", tileLocation.x))
          conditions.push(where("tileLocation.y", "==", tileLocation.y))
        }

        conditions.push(orderBy("createdAt", "desc"))

        return conditions
      }),
      [
        game?.uid,
        receiverId,
        tileLocation?.x,
        tileLocation?.y,
        JSON.stringify(typesToShow),
      ]
    ) || []

  const composingMessage = allMessages?.find((message) => message.draft)

  const messages = allMessages?.filter((msg) => !msg.draft)

  const setComposingMessage = useCallback(
    (messageContent: string) => {
      const baseMessage = composingMessage || genExtraData()
      const composingMessageId = composingMessage?.uid || uuidv4()

      const message = {
        ...baseMessage,
        roundId: currentRound.uid,
        senderId: senderId || null,
        type: typeToSend,
        content: messageContent,
        roundIndex: currentRound.index,
        gameId: game.uid,
        receiverId: receiverId || null,
        tileLocation: tileLocation || null,
        draft: true,
      } as Message

      fbSet("messages", composingMessageId, message)
    },
    [
      composingMessage,
      currentRound,
      game?.uid,
      receiverId,
      tileLocation,
      typeToSend,
      senderId,
    ]
  )

  const sendMessage = useCallback(async () => {
    if (!composingMessage?.content) return

    const messageId = composingMessage.uid
    await fbSet("messages", messageId, {
      ...composingMessage,
      draft: false,
      processingTriggeredAt: Timestamp.now(),
    })

    const response = await fetch("/api/process_message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId } as ProcessMessageArgs),
    })

    if (!response.ok) {
      console.error("Failed to process message")
    }
  }, [composingMessage])

  return {
    composingMessage,
    messages,
    setComposingMessage,
    sendMessage,
  }
}
