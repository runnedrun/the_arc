"use client"

import { Button } from "@/components/ui/button"
import { UserContext, UserProvider } from "@/data/context/UserContext"
import { Game } from "@/data/types/Game"
import { fbCreate, fbSet } from "@/data/writerFe"
import { Timestamp } from "firebase/firestore"
import { ExistingGamesForUser } from "./ExistingGamesForUser"
import { useContext } from "react"
import { docObs, readDoc } from "@/data/readerFe"
import { useObs } from "@/data/useObs"

// Function to create a new game with valley tiles
export const createNewGameWithTiles = async (userId: string): Promise<Game> => {
  // Create a new game
  const newGame = {
    players: [userId], // Start with the user who created the game
    currentRound: 1,
    startTime: Timestamp.now(),
    endTime: null,
    valleyGrid: [],
    elderCouncilLetters: 0,
    name: "New Game",
  } as Game
  const newGameRef = await fbCreate("games", newGame)

  // Create valley tiles in parallel and assign them to the game
  const gridSize = 4 // Assuming a 5x5 grid, adjust as needed

  const valleyGrid = await Promise.all(
    Array(gridSize)
      .fill(null)
      .map((_, y) =>
        Promise.all(
          Array(gridSize)
            .fill(null)
            .map((_, x) =>
              fbCreate("valleyTiles", {
                gameId: newGameRef.id,
                x,
                y,
                history: [],
              }).then((tile) => tile.id)
            )
        )
      )
  )

  // Update the game with the valley grid
  await fbSet("games", newGameRef.id, {
    valleyGrid: valleyGrid.flat(),
  })

  return { ...newGame, valleyGrid: valleyGrid.flat() }
}

const LoggedInUserDisplay = () => {
  const user = useContext(UserContext)
  const userData = useObs(docObs("users", user.user?.uid), [user.user?.uid])
  if (user.loading) return <div></div>
  return <div>{user.user.isAnonymous ? "Not logged in" : userData?.name}</div>
}

export const NewGamePage = () => {
  const user = useContext(UserContext)
  const handleCreateNewGame = async () => {
    const newGame = await createNewGameWithTiles(user.user.uid)
    console.log("New game created:", newGame)
    // You can add additional logic here, such as redirecting to the new game page
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-3xl">
        <div className="absolute right-0 top-0">
          <LoggedInUserDisplay />
        </div>
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Create New Game
        </h1>
        <div className="mb-8 text-center">
          <Button onClick={handleCreateNewGame} size="lg">
            Create New Game
          </Button>
        </div>
        <ExistingGamesForUser></ExistingGamesForUser>
      </div>
    </div>
  )
}

export const NewGamePageWithUser = () => {
  return (
    <UserProvider>
      <NewGamePage />
    </UserProvider>
  )
}
