import { useCallback, useContext, useEffect, useState } from "react"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { queryObs } from "@/data/readerFe"
import { Message } from "@/data/types/Message"
import { useObs } from "@/data/useObs"
import { GameMessages } from "./GameMessages"
import { fbUpdate, genExtraData } from "@/data/writerFe"
import { uniqueId } from "lodash"
import { NPC } from "@/data/types/NPC"

export function NPCDisplay({ npc }: { npc: NPC }) {
  const { currentUserId, game, currentRound } = useContext(GameInterfaceContext)

  const messages = useObs(
    queryObs("messages", ({ where }) => [
      where("gameId", "==", game.uid),
      where("senderId", "==", currentUserId),
      where("receiverId", "==", npc.uid),
      where("archived", "==", false),
    ]),
    [game.uid, currentUserId, npc.uid]
  )

  const currentlyComposingMessage = messages?.find(
    (message) => message.roundId === currentRound.uid
  )

  const currentlyComposingMessageId =
    currentlyComposingMessage?.uid || uniqueId()

  const setCurrentlyComposingMessage = useCallback(
    (messageContent: string) => {
      const baseMessage = currentlyComposingMessage || genExtraData()

      const message = {
        ...baseMessage,
        roundId: currentRound.uid,
        senderId: currentUserId,
        receiverId: npc.uid,
        type: "npc",
        content: messageContent,
        roundIndex: currentRound.index,
        tileLocation: npc.currentTileLocation,
        gameId: npc.gameId,
      } as Message

      fbUpdate("messages", currentlyComposingMessageId, message)
    },
    [currentlyComposingMessageId]
  )

  return (
    <GameMessages
      messages={messages || []}
      composingMessage={currentlyComposingMessage}
      updateComposingMessage={setCurrentlyComposingMessage}
    />
  )
}
