"use client"

import { Button } from "@/components/ui/button"
import { UserLoading } from "@/components/UserLoading"
import { UserContext, UserProvider } from "@/data/context/UserContext"
import { docObs } from "@/data/readerFe"
import { Game, getDefaultGameData } from "@/data/types/Game"
import { useObs } from "@/data/useObs"
import { fbCreate, fbSet } from "@/data/writerFe"
import { Timestamp } from "firebase/firestore"
import { useContext } from "react"
import { ExistingGamesForUser } from "./ExistingGamesForUser"

// Function to create a new game with valley tiles
export const createNewGameWithTiles = async (userId: string): Promise<Game> => {
  const defaultMapSize = 4
  // Create a new game
  const newGame = {
    ...getDefaultGameData(),
    currentRoundNumber: null,
    startTime: null,
    endTime: null,
    elderCouncilLetters: 0,
    name: "New Game",
    createdBy: userId,
    mapSize: defaultMapSize,
  } as Game

  const newGameRef = await fbCreate("games", newGame)

  await fbCreate("players", {
    gameId: newGameRef.id,
    userId,
    currentTileLocation: {
      x: 0,
      y: 0,
    },
    name: "Player 1",
  })

  // Create valley tiles in parallel and assign them to the game

  await Promise.all(
    Array(newGame.mapSize)
      .fill(null)
      .map((_, y) =>
        Promise.all(
          Array(newGame.mapSize)
            .fill(null)
            .map((_, x) =>
              fbCreate("mapTiles", {
                svg: null,
                gameId: newGameRef.id,
                position: {
                  x,
                  y,
                },
                history: [],
              }).then((tile) => tile.id)
            )
        )
      )
  )

  // Update the game with the valley grid
  await fbSet("games", newGameRef.id, {
    ...newGame,
  })

  return { ...newGame }
}

const LoggedInUserDisplay = () => {
  const user = useContext(UserContext)
  const userData = useObs(docObs("users", user.user?.uid), [user.user?.uid])
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
          <UserLoading>
            <LoggedInUserDisplay />
          </UserLoading>
        </div>
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Create New Game
        </h1>
        <div className="mb-8 text-center">
          <UserLoading>
            <Button onClick={handleCreateNewGame} size="lg">
              Create New Game
            </Button>
          </UserLoading>
        </div>
        <UserLoading>
          <ExistingGamesForUser></ExistingGamesForUser>
        </UserLoading>
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
