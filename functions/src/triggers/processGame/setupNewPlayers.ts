import { Player } from "@/data/types/Player"
import { setupCharacterImage } from "../../helpers/setupCharacterImage"
import { fbSet } from "../../helpers/writer"
import { GameProcessingArgs } from "./getGameData"
import { getNpcForGame } from "./getNpcForGame"

const setupImage = async (args: GameProcessingArgs, player: Player) => {
  const image = await setupCharacterImage({
    name: player.name,
    personality: player.playerPersonality,
    environmentDescription: args.game.environmentDescription,
    collectionName: "players",
    uid: player.uid,
    gameId: args.game.uid,
  })
  await fbSet("players", player.uid, {
    playerImageUrl: image,
  })
}

export const setupNewPlayers = async (args: GameProcessingArgs) => {
  await Promise.all(
    args.players.map(async (player) => {
      if (player.hasStartedGame) return
      await Promise.all([
        setupImage(args, player),
        getNpcForGame(args, player.currentTileLocation, true),
      ])
      await fbSet("players", player.uid, {
        hasStartedGame: true,
      })
    })
  )
}
