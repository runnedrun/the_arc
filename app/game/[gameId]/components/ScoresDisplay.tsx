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
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { fbDelete, fbSet } from "@/data/writerFe"

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
  const { players, currentUserId, game } = useContext(GameInterfaceContext)
  const [playerToDelete, setPlayerToDelete] = useState<string | null>(null)

  const handleDeletePlayer = (playerId: string) => {
    fbSet("players", playerId, { archived: true })
    setPlayerToDelete(null)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Player Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {players.map((player) => (
            <div key={player.uid} className="flex items-center gap-2">
              {game.createdBy === currentUserId && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPlayerToDelete(player.uid)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
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

      <AlertDialog
        open={!!playerToDelete}
        onOpenChange={() => setPlayerToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the player from the game. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                playerToDelete && handleDeletePlayer(playerToDelete)
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
