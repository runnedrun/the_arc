"use client"

import { UserContext, UserProvider } from "@/data/context/UserContext"
import { useContext, useState } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { setupTestGameValley, setupTestGameNeonCity } from "./setupTestGame"

const ButtonWithLoading = ({
  onClick,
  children,
}: {
  onClick: () => Promise<any>
  children: React.ReactNode
}) => {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <Button
      onClick={async () => {
        setIsLoading(true)
        await onClick()
        setIsLoading(false)
      }}
    >
      {children}
      {isLoading && <LoadingSpinner className="h-4 w-4" />}
    </Button>
  )
}

const TestButtons = () => {
  const user = useContext(UserContext)
  return (
    <div className="flex flex-col items-start gap-2 p-10">
      <ButtonWithLoading
        onClick={async () => {
          const gameId = await setupTestGameValley({ userId: user.user.uid })
          console.log("gameId", gameId)
        }}
      >
        Setup Test Game
      </ButtonWithLoading>
      <Link href={`/game/2A7IZLkJwK`}>
        <div className="cursor-pointer text-sm text-gray-500 hover:underline">
          Open Game
        </div>
      </Link>
    </div>
  )
}

export default function TestPage() {
  return (
    <UserProvider>
      <TestButtons />
    </UserProvider>
  )
}
