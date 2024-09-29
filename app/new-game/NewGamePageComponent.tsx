import { useContext } from "react"
import { NewGamePageDataContext } from "./NewGamePageClientEntry"
import { creators, setters } from "@/data/fb"
import { Timestamp } from "firebase/firestore"
import { Game } from "@/data/types/Game"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

// Function to create a new game with valley tiles
export const createNewGameWithTiles = async (): Promise<Game> => {
  // Create a new game
  const newGame = {
    players: [], // Start with an empty array of players
    currentRound: 1,
    startTime: Timestamp.now(),
    endTime: null,
    valleyGrid: [],
    elderCouncilLetters: 0,
    name: "New Game",
  } as Game
  const newGameRef = await creators.games(newGame)

  // Create valley tiles in parallel and assign them to the game
  const gridSize = 5 // Assuming a 5x5 grid, adjust as needed

  const valleyGrid = await Promise.all(
    Array(gridSize)
      .fill(null)
      .map((_, y) =>
        Promise.all(
          Array(gridSize)
            .fill(null)
            .map((_, x) =>
              creators
                .valleyTiles({
                  gameId: newGame.uid,
                  x,
                  y,
                  history: [],
                })
                .then((tile) => tile.id)
            )
        )
      )
  )

  // Update the game with the valley grid
  await setters.games(newGameRef.id, {
    valleyGrid,
  })

  return { ...newGame, valleyGrid }
}

export const NewGamePageComponent = () => {
  const { allGames, _isLoading } = useContext(NewGamePageDataContext)

  const handleCreateNewGame = async () => {
    try {
      const newGame = await createNewGameWithTiles()
      console.log("New game created:", newGame)
      // You can add additional logic here, such as redirecting to the new game page
    } catch (error) {
      console.error("Error creating new game:", error)
    }
  }

  if (_isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Create New Game
        </h1>
        <div className="mb-8 text-center">
          <Button onClick={handleCreateNewGame} size="lg">
            Create New Game
          </Button>
        </div>
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
                      <span className="text-gray-800">{game.name}</span>
                      <Button variant="outline">Join</Button>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
