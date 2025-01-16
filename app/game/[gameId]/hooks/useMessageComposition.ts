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
  types: Message["type"][]
  receiverId?: string
  tileLocation?: MapPosition
  senderId?: string
}

export function useMessageComposition({
  types,
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
          where("archived", "==", false),
        ] as OrObservable<PossibleQueryConstraint>[]

        conditions.push(where("type", "in", types))

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
        JSON.stringify(types),
      ]
    ) || []

  const composingMessage = allMessages?.find(
    (message) => message.roundId === currentRound?.uid && message.draft
  )

  const previousMessages = allMessages?.filter(
    (msg) => msg.roundId !== currentRound?.uid || msg.processingTriggeredAt
  )

  const setComposingMessage = useCallback(
    (messageContent: string) => {
      const baseMessage = composingMessage || genExtraData()
      const composingMessageId = composingMessage?.uid || uuidv4()

      const message = {
        ...baseMessage,
        roundId: currentRound.uid,
        senderId: senderId || null,
        type: Array.isArray(types) ? types[0] : types,
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
      types,
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
    previousMessages,
    setComposingMessage,
    sendMessage,
  }
}
