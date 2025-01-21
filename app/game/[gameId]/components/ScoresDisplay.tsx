import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useContext, useState } from "react"
import { GameInterfaceContext } from "../GameInterfaceContext"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { docObs } from "@/data/readerFe"
import { useObs } from "@/data/useObs"
import { combineLatest } from "rxjs"
import { GameMessages } from "../GameMessages"

const ScoredObjectivesDisplay = ({ messageIds }: { messageIds: string[] }) => {
  const messages =
    useObs(
      combineLatest(
        messageIds.map((messageId) => docObs("messages", messageId))
      ),
      [messageIds]
    ) || []

  return <GameMessages messages={messages} />
}

const ScoreLink = ({
  messageIds,
  title,
  children,
}: React.PropsWithChildren<{
  messageIds: string[]
  title: string
}>) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {messageIds.length ? (
        <div
          className="cursor-pointer p-0 hover:underline"
          onClick={() => setIsOpen(true)}
        >
          {children}
        </div>
      ) : (
        <div>{children}</div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {messageIds?.length && (
              <ScoredObjectivesDisplay
                messageIds={messageIds}
              ></ScoredObjectivesDisplay>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export const ScoresDisplay = () => {
  const { players, currentUserId } = useContext(GameInterfaceContext)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Player Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {players.map((player) => (
            <div key={player.uid} className="flex gap-2">
              <div className="font-bold">{player.name}:</div>
              <div className="flex flex-wrap gap-2">
                <div>
                  {player.userId === currentUserId ? (
                    <ScoreLink
                      messageIds={player.secretObjectivesScored || []}
                      title="Scored Secret Objectives"
                    >
                      Secret: {player.secretObjectivePoints || 0}
                    </ScoreLink>
                  ) : (
                    player.secretObjectivePoints || 0
                  )}
                </div>
                <div>
                  {player.userId === currentUserId ? (
                    <ScoreLink
                      messageIds={player.publicObjectivesScored || []}
                      title="Scored Public Objectives"
                    >
                      Public: {player.publicObjectivePoints || 0}
                    </ScoreLink>
                  ) : (
                    player.publicObjectivePoints || 0
                  )}
                </div>
                <div>
                  Total:{" "}
                  {(player.secretObjectivePoints || 0) +
                    (player.publicObjectivePoints || 0)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
