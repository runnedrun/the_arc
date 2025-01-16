import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GameMessages } from "./GameMessages"
import { useMessageComposition } from "./hooks/useMessageComposition"
import { useContext } from "react"
import { GameInterfaceContext } from "./GameInterfaceContext"

export const ElderCouncilDisplay = () => {
  const { currentPlayer } = useContext(GameInterfaceContext)
  const {
    previousMessages,
    composingMessage,
    setComposingMessage,
    sendMessage,
  } = useMessageComposition({
    types: ["elderCouncil", "recap"],
    senderId: currentPlayer?.uid,
    receiverId: "elderCouncil",
  })

  return (
    <Card className="ml-4 flex h-[700px] w-1/4 flex-col">
      <CardHeader>
        <CardTitle>Elder Council</CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 grow">
        <GameMessages
          messages={previousMessages || []}
          composingMessage={composingMessage}
          updateComposingMessage={setComposingMessage}
          sendMessage={sendMessage}
        ></GameMessages>
      </CardContent>
    </Card>
  )
}
