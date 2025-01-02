import { queryObs } from "@/data/readerFe"
import { Player } from "@/data/types/Player"
import { Round } from "@/data/types/Round"
import { useObs } from "@/data/useObs"
import { createContext, useContext } from "react"
import { GameInterfaceContext } from "./GameInterfaceContext"

const TokenCountContext = createContext(
  null as {
    charactersUsedThisRound: number
    charactersRemaining: number
    charactersAvailable: number
  }
)

export const ProvideTokenCountContext = ({
  children,
}: React.PropsWithChildren<object>) => {
  const { currentRound: round, currentPlayer } =
    useContext(GameInterfaceContext)
  const messagesForCurrentRound =
    useObs(
      queryObs("messages", ({ where }) => [where("roundId", "==", round.uid)]),
      [round.uid]
    ) || []
  const charactersUsedThisRound = messagesForCurrentRound.reduce(
    (acc, message) => {
      return message.content.length
    },
    0
  )
  const charactersRemaining = currentPlayer.letters - charactersUsedThisRound
  return (
    <TokenCountContext.Provider
      value={{
        charactersUsedThisRound,
        charactersRemaining,
        charactersAvailable: currentPlayer.letters,
      }}
    >
      {children}
    </TokenCountContext.Provider>
  )
}
