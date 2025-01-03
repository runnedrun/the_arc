import { useCallback, useContext, useEffect, useState } from "react"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { queryObs } from "@/data/readerFe"
import { Message } from "@/data/types/Message"
import { useObs } from "@/data/useObs"
import { GameMessages } from "./GameMessages"
import { fbSet, genExtraData } from "@/data/writerFe"
import { uniqueId } from "lodash-es"
import { NPC } from "@/data/types/NPC"

export function NPCDisplay({ npc }: { npc: NPC }) {
  const { game, currentRound, currentPlayer } = useContext(GameInterfaceContext)

  const allMessages =
    useObs(
      queryObs("messages", ({ where }) => [
        where("gameId", "==", game.uid),
        where("senderId", "==", currentPlayer.uid),
        where("receiverId", "==", npc.uid),
        where("archived", "==", false),
      ]),
      [game?.uid, currentPlayer?.uid, npc.uid]
    ) || []

  const currentlyComposingMessage = allMessages?.find(
    (message) => message.roundId === currentRound.uid
  )
  const messagesFromPrevRounds = allMessages.filter(
    (_) => _.roundIndex < currentRound.index
  )

  const currentlyComposingMessageId =
    currentlyComposingMessage?.uid || uniqueId()

  const setCurrentlyComposingMessage = useCallback(
    (messageContent: string) => {
      const baseMessage = currentlyComposingMessage || genExtraData()

      const message = {
        ...baseMessage,
        roundId: currentRound.uid,
        senderId: currentPlayer.uid,
        receiverId: npc.uid,
        type: "npc",
        content: messageContent,
        roundIndex: currentRound.index,
        tileLocation: npc.currentTileLocation,
        gameId: npc.gameId,
      } as Message

      fbSet("messages", currentlyComposingMessageId, message)
    },
    [
      currentlyComposingMessageId,
      currentRound?.uid,
      currentPlayer?.uid,
      npc.uid,
    ]
  )

  return (
    <GameMessages
      messages={messagesFromPrevRounds || []}
      composingMessage={currentlyComposingMessage}
      updateComposingMessage={setCurrentlyComposingMessage}
    />
  )
}
