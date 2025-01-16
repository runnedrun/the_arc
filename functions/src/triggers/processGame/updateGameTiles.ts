import { Game } from "@/data/types/Game"
import { MapTile } from "@/data/types/MapTile"
import { getDefaultMessage, Message } from "@/data/types/Message"
import { isTestMode } from "@/helpers/getUuid"
import { zodResponseFormat } from "openai/helpers/zod"
import { ChatCompletionMessageParam } from "openai/resources/chat/completions"
import { z } from "zod"
import { getOpenAIClient } from "../../helpers/getOpenAIClient"
import { queryDocs } from "../../helpers/reader"
import { backendNow, fbCreate, fbSet } from "../../helpers/writer"
import { getMessageStrings } from "../processRound/getMessageStrings"
import { GameProcessingArgs } from "./getGameData"
import { uploadImageToStorage } from "./uploadImageToCloudStorage"
import { sampleTileDescriptions } from "../../mocks/sampleTileDescriptions"
import path from "path"

const TileDescriptions = z.object({
  tiles: z.array(
    z.object({
      posX: z.number(),
      posY: z.number(),
      description: z.string(),
    })
  ),
})

const getTileDescriptionsFromOpenAI = async (game: Game) => {
  const openAiClient = getOpenAIClient()
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a skill board game environment designer. You receive a description of an environment then return a a ${game.mapSize}x${game.mapSize} grid of tiles with descriptions of each tile.`,
    },
    {
      role: "user",
      content: getInitialPrompt(game),
    },
  ]

  const completion = await openAiClient.beta.chat.completions.parse({
    model: "gpt-4o",
    messages,
    response_format: zodResponseFormat(TileDescriptions, "tiles"),
    temperature: 0.7,
  })

  if (isTestMode()) {
    console.log(
      "writing tileDescriptions.json",
      completion.choices[0].message.parsed.tiles
    )
  }

  return completion.choices[0].message.parsed.tiles
}

const getTileDescriptions = async (game: Game) => {
  return isTestMode()
    ? sampleTileDescriptions.tiles
    : getTileDescriptionsFromOpenAI(game)
  // return getTileDescriptionsFromOpenAI(game)
}

const getInitialPrompt = (game: Game) =>
  `Design a ${game.mapSize}x${game.mapSize} world map where each tile represents an equal sized portion of the world.
The world you are mapping is described as follows: 
${game.environmentDescription}
`

const getDallePrompt = (
  tileHistory: Message[],
  previousPrompt: string,
  gameArgs: GameProcessingArgs
) => {
  const previousPromptExplanation = `
  You previously used this prompt to reprsent the state of this environment:
  ${previousPrompt || "No previous prompt"}
  Make a new prompt that reflects this recent history of the environment from this year:
  ${getMessageStrings(tileHistory, gameArgs)}
  `

  return `Create a dall-e prompt for an image of the current state of this environment.
${previousPromptExplanation}

The environment is situated within this world:
${gameArgs.game.environmentDescription}

Requirements:
- the image should be in a vector art style
- the image must fill the whole frame, no text, no border
- Show the environment from a slightly elevated angle
- The prompt must be breif, 1 sentence or less and only describe visual elements, with no addition flavor text.
`
}

const updateTileExplorationStatus = async (game: Game) => {
  const [players, tiles] = await Promise.all([
    queryDocs("players", (ref) =>
      ref.where("gameId", "==", game.uid).where("archived", "==", false)
    ),
    queryDocs("mapTiles", (ref) =>
      ref.where("gameId", "==", game.uid).where("archived", "==", false)
    ),
  ])

  await Promise.all(
    tiles.map(async (tile) => {
      const shouldUpdateExploredStatus = players.some(
        (player) =>
          player.currentTileLocation?.x === tile.position.x &&
          player.currentTileLocation?.y === tile.position.y
      )

      if (shouldUpdateExploredStatus) {
        await fbSet("mapTiles", tile.uid, {
          ...tile,
          explored: true,
        })
      }
    })
  )

  return { players, tiles }
}

export const updateGameTiles = async (args: GameProcessingArgs) => {
  const openAiClient = getOpenAIClient()

  // Generate initial descriptions if no tiles exist
  const existingTiles = await queryDocs("mapTiles", (ref) =>
    ref.where("gameId", "==", args.game.uid).where("archived", "==", false)
  )

  if (existingTiles.length === 0) {
    const tileDescriptions = await getTileDescriptions(args.game)
    // Create initial tiles
    await Promise.all(
      tileDescriptions.map(async (tile) => {
        const newTile: MapTile = {
          gameId: args.game.uid,
          position: { x: tile.posX, y: tile.posY },
          explored: false,
          lastImageGeneratedAt: null,
          previousDallePrompt: null,
          imageUrl: null,
        }

        const newMessage: Message = getDefaultMessage({
          content: tile.description,
          type: "tileHistory",
          tileLocation: { x: tile.posX, y: tile.posY },
          gameId: args.game.uid,
          roundId: null,
          roundIndex: -1,
          senderId: "tileHistory",
          receiverId: null,
          processedAt: backendNow(),
        })

        await fbCreate("messages", newMessage)
        await fbCreate("mapTiles", newTile)
      })
    )
  }

  await updateTileExplorationStatus(args.game)

  // Update images for explored tiles
  const allTiles = await queryDocs("mapTiles", (ref) =>
    ref.where("gameId", "==", args.game.uid).where("archived", "==", false)
  )

  await Promise.all(
    allTiles.map(async (tile) => {
      if (!tile.explored) return

      const tileHistory = await queryDocs("messages", (ref) =>
        ref
          .where("gameId", "==", args.game.uid)
          .where("type", "==", "tileHistory")
          .where("tileLocation.x", "==", tile.position.x)
          .where("tileLocation.y", "==", tile.position.y)
          .orderBy("processedAt", "asc")
      )

      const messagesSinceLastPrompt = tileHistory.filter(
        (message) => message.createdAt > tile.lastImageGeneratedAt
      )

      if (messagesSinceLastPrompt.length === 0) {
        return
      }

      const prompt = getDallePrompt(
        messagesSinceLastPrompt,
        tile.previousDallePrompt,
        args
      )

      // Generate DALL-E prompt
      const dallePromptCompletion = await openAiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are an expert at writing prompts for DALL-E 3 that generates an image a setting based on the history of that setting.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      })

      const dallePrompt = dallePromptCompletion.choices[0].message.content

      // Generate image with DALL-E 3
      const imageResponse = await openAiClient.images.generate({
        model: "dall-e-3",
        prompt: dallePrompt,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      })

      const imageUrl = imageResponse.data[0].url

      const storedImageUrl = await uploadImageToStorage(
        imageUrl,
        args.game.uid,
        path.join("tiles", `${tile.position.x}_${tile.position.y}.jpg`)
      )

      // Update tile with new image
      await fbSet("mapTiles", tile.uid, {
        ...tile,
        imageUrl: storedImageUrl,
        lastImageGeneratedAt: backendNow(),
        previousDallePrompt: dallePrompt,
      })
    })
  )
}
