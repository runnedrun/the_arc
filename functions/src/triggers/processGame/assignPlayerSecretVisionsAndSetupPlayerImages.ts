import { GameProcessingArgs } from "./getGameData"
import { fbSet } from "../../helpers/writer"
import { z } from "zod"
import { setupCharacterImage } from "../../helpers/setupCharacterImage"
import { createObjectives } from "./createObjectives"

const setupPlayerImages = async (args: GameProcessingArgs) => {
  await Promise.all(
    args.players.map(async (player) => {
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
    })
  )
}

export const assignPlayerSecretVisionsAndSetupPlayerImages = async (
  args: GameProcessingArgs
) => {
  await Promise.all([setupPlayerImages(args)])
}
