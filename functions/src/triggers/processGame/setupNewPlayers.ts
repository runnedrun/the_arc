import { Player } from "@/data/types/Player"
import { setupCharacterImage } from "../../helpers/setupCharacterImage"
import { fbSet } from "../../helpers/writer"
import { GameProcessingArgs } from "./getGameData"
import { getNpcForGame } from "./getNpcForGame"
import { updateCharacterCountForPlayerForRound } from "./startNewRound"
import { createObjectives } from "./createObjectives"

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

export const setupPlayer = async (args: GameProcessingArgs, player: Player) => {
  console.log("setting up player", player.uid)

  const npcsOnPlayerTile = args.npcs.filter(
    (npc) =>
      npc.currentTileLocation.x === player.currentTileLocation.x &&
      npc.currentTileLocation.y === player.currentTileLocation.y
  )

  const playerTileHasNpc = npcsOnPlayerTile.length > 0

  const setupPromise = []

  if (!playerTileHasNpc) {
    console.log("getting npc for player", player.uid)
    setupPromise.push(getNpcForGame(args, player.currentTileLocation, true))
  }

  if (args.game.gameSetupCompletedAt) {
    console.log("creating objectives for player", player.uid)
    setupPromise.push(createObjectives(args, player))
  }

  setupPromise.push(setupImage(args, player))
  setupPromise.push(updateCharacterCountForPlayerForRound(args, player))

  // create the objective for the player if the game has already started

  const mapTile = args.mapTiles.find(
    (tile) =>
      tile.position.x === player.currentTileLocation.x &&
      tile.position.y === player.currentTileLocation.y
  )

  if (mapTile) {
    setupPromise.push(
      fbSet("mapTiles", mapTile.uid, {
        explored: true,
      })
    )
  }

  await Promise.all(setupPromise)

  await fbSet("players", player.uid, {
    hasStartedGame: true,
  })
}

export const setupNewPlayers = async (args: GameProcessingArgs) => {
  await Promise.all(
    args.players.map(async (player) => {
      if (!player.hasStartedGame) {
        await setupPlayer(args, player)
      }
    })
  )
}
