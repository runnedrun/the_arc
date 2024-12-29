import { Button } from "@/components/ui/button"
import Link from "next/link"
import { EditableGameName } from "./EditableGameName"
import { useObs } from "@/data/useObs"
import { docObs } from "@/data/readerFe"
import { Skeleton } from "@/components/ui/skeleton"

interface GameListItemProps {
  gameId: string
}

export const GameListItem: React.FC<GameListItemProps> = ({ gameId }) => {
  const game = useObs(docObs("games", gameId), [gameId])

  if (!game) {
    return (
      <li className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-9 w-[70px]" />
        </div>
      </li>
    )
  }

  return (
    <li className="px-6 py-4 transition duration-150 ease-in-out hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <EditableGameName gameId={gameId} initialName={game.name} />
        <Link href={`/join/${gameId}`}>
          <Button variant="outline">Join</Button>
        </Link>
      </div>
    </li>
  )
}
