import { useContext } from "react"
import { NewGamePageDataContext } from "./NewGamePageClientEntry"
import { creators, setters } from "@/data/fb"
import { Timestamp } from "firebase/firestore"
import { Game } from "@/data/types/Game"

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
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
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
          <button
            onClick={handleCreateNewGame}
            className="transform rounded-lg bg-blue-500 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-600"
          >
            Create New Game
          </button>
        </div>
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <h2 className="border-b border-gray-200 bg-gray-50 px-6 py-4 text-xl font-semibold">
            Existing Games
          </h2>
          <ul className="divide-y divide-gray-200">
            {allGames.map((game) => (
              <li
                key={game.uid}
                className="px-6 py-4 transition duration-150 ease-in-out hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-800">{game.name}</span>
                  <button className="font-medium text-blue-500 hover:text-blue-600">
                    Join
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
