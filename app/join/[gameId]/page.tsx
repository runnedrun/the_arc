"use client"

import { UserContext, UserProvider } from "@/data/context/UserContext"
import { use, useContext } from "react"
import { JoinGameFlow } from "./JoinGameFlow"
import { UserLoading } from "@/components/UserLoading"

export default function JoinGamePage({
  params,
}: {
  params: Promise<{ gameId: string }>
}) {
  const { gameId } = use(params)

  return (
    <UserProvider>
      <div className="container mx-auto max-w-2xl p-4">
        <UserLoading>
          <JoinGameFlow gameId={gameId} />
        </UserLoading>
      </div>
    </UserProvider>
  )
}
