"use client"

import { UserProvider } from "@/data/context/UserContext"
import { GameDisplay } from "./GameDisplay"
import { use } from "react"
import { ProvideGameInterfaceContext } from "./GameInterfaceContext"

export default function GamePage({
  params,
}: {
  params: Promise<{ gameId: string }>
}) {
  const gameId = use(params).gameId

  return (
    <UserProvider>
      <ProvideGameInterfaceContext gameId={gameId}>
        <GameDisplay />
      </ProvideGameInterfaceContext>
    </UserProvider>
  )
}
