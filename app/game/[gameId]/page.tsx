"use client"

import { UserProvider } from "@/data/context/UserContext"
import { GameDisplay } from "./GameDisplay"
import { use } from "react"

export default function GamePage({
  params,
}: {
  params: Promise<{ gameId: string }>
}) {
  const gameId = use(params).gameId

  return (
    <UserProvider>
      <GameDisplay gameId={gameId} />
    </UserProvider>
  )
}
