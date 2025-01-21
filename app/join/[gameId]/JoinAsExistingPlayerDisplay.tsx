import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { queryObs } from "@/data/readerFe"
import { useObs } from "@/data/useObs"
import { fbCreate, fbUpdate, fbDelete } from "@/data/writerFe"
import { useToast } from "@/hooks/use-toast"
import { useContext } from "react"
import { UserContext } from "@/data/context/UserContext"
import { docObs } from "@/data/readerFe"
import { Trash2 } from "lucide-react"

interface JoinAsExistingPlayerDisplayProps {
  gameId: string
  userId: string
}

export function JoinAsExistingPlayerDisplay({
  gameId,
  userId,
}: JoinAsExistingPlayerDisplayProps) {
  const availablePlayers =
    useObs(
      queryObs("players", ({ where }) => [
        where("gameId", "==", gameId),
        where("archived", "==", false),
      ]),
      [gameId]
    ) || []

  const handleSelectPlayer = async (playerId: string) => {
    await fbUpdate("players", playerId, { userId })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join as an Existing Player</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {availablePlayers.length > 0 ? (
            <div className="space-y-2">
              {availablePlayers.map((player) => (
                <div key={player.uid} className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                    onClick={() => handleSelectPlayer(player.uid)}
                  >
                    {player.name || "Unnamed Character"}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No existing characters available to join.
            </p>
          )}

          <Button
            onClick={() => {
              fbCreate("players", {
                gameId,
                userId,
                name: "New Player",
                secretObjectivesScored: [],
                publicObjectivesScored: [],
                secretObjectivePoints: 0,
                publicObjectivePoints: 0,
              })
            }}
            className="mt-4 w-full"
          >
            Create New Character
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
