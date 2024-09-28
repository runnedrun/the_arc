import { useContext, useEffect } from "react"
import { ExamplePageDataContext } from "./ExamplePageClientEntry"
import { creators, setters } from "@/data/fb"
import { Timestamp } from "firebase/firestore"

export const ExamplePageComponent = () => {
  const { allActions, exampleAction, _isLoading } = useContext(
    ExamplePageDataContext
  )

  const createNewGame = async () => {
    const newGame = await creators.games({
      currentRound: 0,
      elderCouncilLetters: 0,
      players: [],
      startTime: Timestamp.now(),
      endTime: null,
      valleyGrid: [],
      name: "New Game",
    })
  }

  const updateGame = async () => {
    const newGame = await setters.games("id", {
      currentRound: 1,
    })
  }

  if (_isLoading) {
    return <div>Loading...</div>
  }
  return <div>Example Page Component</div>
}
