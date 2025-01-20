import { getDefaultRoundData, Round } from "@/data/types/Round"
import { fbCreate, fbSet } from "../../helpers/writer"
import { GameProcessingArgs } from "./getGameData"
import { isNil } from "lodash-es"

export const startNewRound = async ({
  game,
  currentRound,
  players,
}: GameProcessingArgs) => {
  const currentRoundIndex = isNil(currentRound?.index) ? -1 : currentRound.index
  const newRoundIndex = currentRoundIndex + 1
  const charactersInCurrentRound =
    game.startingCharacterCount - newRoundIndex * 10

  const newRound: Round = {
    ...getDefaultRoundData(),
    gameId: game.uid,
    index: newRoundIndex,
    playersCompletedAt: {},
  }

  await Promise.all(
    players.map((player) => {
      return fbSet("players", player.uid, {
        letters: charactersInCurrentRound,
      })
    })
  )

  await fbCreate("rounds", newRound)
  return newRound
}
