"use client"

import logo from "@/assets/the_arc_no_background.png"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { queryObs } from "@/data/readerFe"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useContext, useEffect } from "react"
import { firstValueFrom } from "rxjs"
import { createNewGameWithCreatorPlayer } from "../new-game/NewGamePage"
import { UserContext, UserProvider } from "@/data/context/UserContext"
import { showTutorialParamName } from "../join/[gameId]/JoinGameFlow"
import { defaultGameEnvironmentsList } from "../game/[gameId]/defaultGameEnvironments"

const setupSampleGame = async (userId: string) => {
  const existingSampleGame = await firstValueFrom(
    queryObs("games", ({ where }) => {
      return [where("sampleGame", "==", true), where("createdBy", "==", userId)]
    })
  )

  console.log("existingSampleGame", existingSampleGame)

  if (existingSampleGame[0]) {
    return existingSampleGame[0].uid
  }

  const { game: newGame } = await createNewGameWithCreatorPlayer(userId, {
    sampleGame: true,
    environmentName: defaultGameEnvironmentsList[0].name,
    environmentDescription: defaultGameEnvironmentsList[0].description,
  })
  return newGame.uid
}

export const SampleGameDisplay = () => {
  const { user } = useContext(UserContext)
  const router = useRouter()

  useEffect(() => {
    if (user?.uid) {
      setupSampleGame(user.uid).then((gameId) => {
        router.replace(`/join/${gameId}?${showTutorialParamName}=true`)
      })
    }
  }, [user?.uid])

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <div>
        <Image src={logo} alt="Arcon" width={400} height={400} />
      </div>
      <div>
        <LoadingSpinner></LoadingSpinner>
      </div>
    </div>
  )
}
