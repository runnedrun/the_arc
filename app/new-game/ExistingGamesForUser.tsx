import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserContext } from "@/data/context/UserContext"
import { queryObs } from "@/data/readerFe"
import { useObs } from "@/data/useObs"
import { useContext } from "react"
import { EditableGameName } from "./EditableGameName"
import Link from "next/link"

export const ExistingGamesForUser: React.FC<{}> = () => {
  const user = useContext(UserContext)
  const userId = user.user?.uid
  const allGames =
    useObs(
      queryObs("games", ({ where }) => [
        where("players", "array-contains", userId || null),
        where("archived", "==", false),
      ]),
      [userId]
    ) || []
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Existing Games</h2>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <ul className="divide-y divide-gray-200">
            {allGames.map((game) => (
              <li
                key={game.uid}
                className="px-6 py-4 transition duration-150 ease-in-out hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <EditableGameName gameId={game.uid} initialName={game.name} />
                  <Link href={`/join/${game.uid}`}>
                    <Button variant="outline">Join</Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
