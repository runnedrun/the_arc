import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GameMessages } from "./GameMessages"
import { useMessageComposition } from "./hooks/useMessageComposition"

export const ElderCouncilDisplay = () => {
  const { previousMessages, composingMessage, setComposingMessage } =
    useMessageComposition({
      type: "elderCouncil",
    })

  return (
    <Card className="ml-4 w-1/4">
      <CardHeader>
        <CardTitle>Elder Council</CardTitle>
      </CardHeader>
      <CardContent>
        <GameMessages
          messages={previousMessages || []}
          composingMessage={composingMessage}
          updateComposingMessage={setComposingMessage}
        ></GameMessages>
      </CardContent>
    </Card>
  )
}
