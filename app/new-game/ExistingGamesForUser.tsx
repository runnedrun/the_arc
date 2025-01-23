import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserContext } from "@/data/context/UserContext"
import { queryObs } from "@/data/readerFe"
import { useObs } from "@/data/useObs"
import { useContext } from "react"
import { GameListItem } from "./GameListItem"

export const ExistingGamesForUser: React.FC<{}> = () => {
  const user = useContext(UserContext)
  const userId = user.user?.uid
  const allPlayersForPlayer =
    useObs(
      queryObs("players", ({ where }) => [where("userId", "==", userId)]),
      [userId]
    ) || []

  const allGameIdsForPlayer = allPlayersForPlayer.map((player) => player.gameId)
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Existing Games</h2>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <ul className="divide-y divide-gray-200">
            {allGameIdsForPlayer.map((gameId) => (
              <GameListItem key={gameId} gameId={gameId} />
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
