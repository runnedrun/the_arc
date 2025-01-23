import { queryObs, SKIP } from "@/data/readerFe"
import { Player } from "@/data/types/Player"
import { Round } from "@/data/types/Round"
import { useObs } from "@/data/useObs"
import { createContext, useContext } from "react"
import { GameInterfaceContext } from "./GameInterfaceContext"

export const TokenCountContext = createContext(
  null as {
    charactersUsedThisRound: number
    charactersRemaining: number
    charactersAvailable: number
  }
)

export const ProvideTokenCountContext = ({
  children,
}: React.PropsWithChildren<object>) => {
  const {
    currentRound: round,
    currentPlayer,
    game,
  } = useContext(GameInterfaceContext)
  const messagesForCurrentRound =
    useObs(
      queryObs("messages", ({ where }) => [
        where("roundId", "==", round?.uid || null),
        where("senderId", "==", currentPlayer?.uid || "__never__"),
      ]),
      [round?.uid]
    ) || []

  const charactersUsedThisRound = messagesForCurrentRound.reduce(
    (acc, message) => {
      return acc + message.content.length
    },
    0
  )

  const letterCount = currentPlayer?.letters || 0

  const charactersRemaining = letterCount - charactersUsedThisRound

  return (
    <TokenCountContext.Provider
      value={{
        charactersUsedThisRound,
        charactersRemaining,
        charactersAvailable: letterCount,
      }}
    >
      {children}
    </TokenCountContext.Provider>
  )
}
