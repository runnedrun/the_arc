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

interface MessageCompositionOptions {
  type: ("npc" | "elderCouncil" | "tileHistory" | "tileAction")[]
  receiverId?: string
  tileLocation?: MapPosition
  senderId?: string
}

export function useMessageComposition({
  type,
  receiverId,
  tileLocation,
  senderId,
}: MessageCompositionOptions) {
  const { game, currentRound } = useContext(GameInterfaceContext)

  const allMessages =
    useObs(
      queryObs("messages", ({ where, orderBy }) => {
        const conditions = [
          where("gameId", "==", game?.uid),
          where("archived", "==", false),
        ] as OrObservable<PossibleQueryConstraint>[]

        conditions.push(where("type", "in", type))

        if (receiverId) {
          conditions.push(where("receiverId", "==", receiverId))
        }

        if (tileLocation) {
          conditions.push(where("tileLocation.x", "==", tileLocation.x))
          conditions.push(where("tileLocation.y", "==", tileLocation.y))
        }

        conditions.push(orderBy("createdAt", "desc"))

        return conditions
      }),
      [game?.uid, receiverId, tileLocation?.x, tileLocation?.y, type]
    ) || []

  console.log("allMessages", allMessages)

  const composingMessage = allMessages?.find(
    (message) => message.roundId === currentRound?.uid
  )

  const previousMessages = allMessages.filter(
    (msg) => msg.roundIndex < currentRound?.index
  )

  const setComposingMessage = useCallback(
    (messageContent: string) => {
      const baseMessage = composingMessage || genExtraData()
      const composingMessageId = composingMessage?.uid || uuidv4()

      const message = {
        ...baseMessage,
        roundId: currentRound.uid,
        senderId: senderId || null,
        type: Array.isArray(type) ? type[0] : type,
        content: messageContent,
        roundIndex: currentRound.index,
        gameId: game.uid,
        receiverId: receiverId || null,
        tileLocation: tileLocation || null,
      } as Message

      fbSet("messages", composingMessageId, message)
    },
    [
      composingMessage,
      currentRound,
      game?.uid,
      receiverId,
      tileLocation,
      type,
      senderId,
    ]
  )

  return {
    composingMessage,
    previousMessages,
    setComposingMessage,
  }
}
