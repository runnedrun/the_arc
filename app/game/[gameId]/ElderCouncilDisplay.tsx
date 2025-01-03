import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { useCallback, useContext, useState } from "react"
import { GameMessages } from "./GameMessages"
import { useObs } from "@/data/useObs"
import { queryObs } from "@/data/readerFe"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { fbSet, genExtraData } from "@/data/writerFe"
import { Message } from "@/data/types/Message"
import { uniqueId } from "lodash-es"

export const ElderCouncilDisplay = () => {
  const { currentRound, game, currentPlayer } = useContext(GameInterfaceContext)
  const elderCoucilMessages =
    useObs(
      queryObs("messages", ({ where }) => {
        return [
          where("type", "==", "elderCouncil"),
          where("senderId", "==", currentPlayer?.uid || "__never__"),
          where("gameId", "==", game?.uid || "__never__"),
          where("archived", "==", false),
        ]
      }),
      [game?.uid, currentPlayer?.uid]
    ) || []

  const prevRoundMessages = elderCoucilMessages.filter(
    (_) => _.roundIndex < currentRound.index
  )

  const composingMessage = elderCoucilMessages.find(
    (_) => _.roundId === currentRound.uid
  )

  const setCurrentlyComposingMessage = useCallback(
    (messageContent: string) => {
      const baseMessage = composingMessage || genExtraData()
      const composingMessageId = composingMessage?.uid || uniqueId()

      const message = {
        ...baseMessage,
        roundId: currentRound.uid,
        senderId: currentPlayer.uid,
        type: "elderCouncil",
        content: messageContent,
        roundIndex: currentRound.index,
        gameId: game.uid,
      } as Message

      fbSet("messages", composingMessageId, message)
    },
    [composingMessage?.uid, currentRound?.uid, currentPlayer?.uid, game?.uid]
  )

  return (
    <Card className="ml-4 w-1/4">
      <CardHeader>
        <CardTitle>Elder Council</CardTitle>
      </CardHeader>
      <CardContent>
        <GameMessages
          messages={prevRoundMessages}
          composingMessage={composingMessage}
          updateComposingMessage={setCurrentlyComposingMessage}
        ></GameMessages>
      </CardContent>
    </Card>
  )
}
