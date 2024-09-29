import { useContext } from "react"
import { ExamplePageDataContext } from "./ExamplePageClientEntry"
import { creators, setters } from "@/data/fb"
import { Timestamp } from "firebase/firestore"
import { UserContext } from "../../data/context/UserContext"
import { useObs } from "@/data/useObs"
import { docObs } from "@/data/readerFe"

const ExampleChildComponent = ({ id }: { id: string }) => {
  const data = useObs(docObs("games", id), [id])
  return <div>{JSON.stringify(data)}</div>
}

export const ExamplePageComponent = () => {
  const { allActions, exampleAction, _isLoading } = useContext(
    ExamplePageDataContext
  )
  const { user, loading: userLoading } = useContext(UserContext)

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

  if (_isLoading || userLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      Example Page Component (User ID: {user?.uid})
      <div>
        <ExampleChildComponent id="123"></ExampleChildComponent>
      </div>
    </div>
  )
}
