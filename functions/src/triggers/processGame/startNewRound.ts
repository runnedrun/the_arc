import { getDefaultRoundData, Round } from "@/data/types/Round"
import { fbCreate, fbSet } from "../../helpers/writer"
import { GameProcessingArgs } from "./getGameData"
import { isNil } from "lodash-es"
import { Player } from "@/data/types/Player"

export const updateCharacterCountForPlayerForRound = async (
  args: GameProcessingArgs,
  player: Player
) => {
  const currentRoundIndex = isNil(args.currentRound?.index)
    ? -1
    : args.currentRound.index

  const charactersInCurrentRound =
    args.game.startingCharacterCount - currentRoundIndex * 10

  await fbSet("players", player.uid, {
    letters: charactersInCurrentRound,
  })
}

export const startNewRound = async (args: GameProcessingArgs) => {
  const { game, players } = args
  const currentRoundIndex = isNil(args.currentRound?.index)
    ? -1
    : args.currentRound.index
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
      return updateCharacterCountForPlayerForRound(args, player)
    })
  )

  const ref = await fbCreate("rounds", newRound)
  return { ...newRound, uid: ref.id }
}
