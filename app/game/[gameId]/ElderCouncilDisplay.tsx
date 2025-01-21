import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useContext } from "react"
import { GameInterfaceContext } from "./GameInterfaceContext"
import { GameMessages } from "./GameMessages"
import { useMessageComposition } from "./hooks/useMessageComposition"
import { sortBy } from "lodash-es"
import { useObjectives } from "./useObjectives"

export const ElderCouncilDisplay = () => {
  const { currentPlayer, game } = useContext(GameInterfaceContext)
  const {
    messages: previousMessages,
    composingMessage,
    setComposingMessage,
    sendMessage,
  } = useMessageComposition({
    typesToShow: ["elderCouncil", "recap"],
    senderId: currentPlayer?.uid,
    receiverId: "elderCouncil",
    typeToSend: "elderCouncil",
  })

  const { allObjectives } = useObjectives()

  const allMessages = sortBy(
    [...previousMessages, ...allObjectives],
    "createdAt"
  )

  return (
    <Card className="flex min-h-0 w-full grow flex-col">
      <CardHeader>
        <CardTitle>Elder Council</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 grow flex-col">
        <GameMessages
          messages={allMessages}
          composingMessage={composingMessage}
          updateComposingMessage={setComposingMessage}
          sendMessage={sendMessage}
        ></GameMessages>
      </CardContent>
    </Card>
  )
}
