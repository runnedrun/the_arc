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
import { generateWithGetImage } from "../../helpers/generateWithGetImage"

const TileDescriptions = z.object({
  tiles: z.array(
    z.object({
      posX: z.number(),
      posY: z.number(),
      description: z.string(),
    })
  ),
})

const TileMetadata = z.object({
  title: z.string(),
  description: z.string(),
  dallePrompt: z.string(),
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

const getTileMetadataPrompt = (
  tileHistory: Message[],
  tile: MapTile,
  gameArgs: GameProcessingArgs
) => {
  const previousPromptExplanation = `
  Current description of the environment:
  ${tile.description || "No previous prompt"}

  Current title of the environment:
  ${tile.title || "No title"}
  
  Recent history of the environment, since the description was last updated:
  ${getMessageStrings(tileHistory, gameArgs)}
  `

  return `Generate a new title, description, and DALL-E prompt for this environment.

${previousPromptExplanation}

The environment is situated within this world:
${gameArgs.game.environmentDescription}

Requirements for each field:
- Title: A brief, evocative name for this location (10 words or less)
- Description: A dry, factual description of the current state of this environment (30 words or less)
- DALL-E prompt: A prompt for DALL-E 3 to generate an image of the environment in a hand drawn animation style, showing ONLY the environment, filling the whole frame without text or borders (1 sentence)`
}

const updateTileExplorationStatus = async (args: GameProcessingArgs) => {
  const [players, tiles] = await Promise.all([
    queryDocs("players", (ref) => ref.where("gameId", "==", args.game.uid)),
    queryDocs("mapTiles", (ref) => ref.where("gameId", "==", args.game.uid)),
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
          exploredInRoundId: args.currentRound?.uid || null,
          exploredInRoundIndex: args.currentRound?.index || null,
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
    ref.where("gameId", "==", args.game.uid)
  )

  if (existingTiles.length === 0) {
    console.log("generating initial tile descriptions")
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
          title: null,
          description: null,
          exploredInRoundId: null,
          exploredInRoundIndex: null,
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

  await updateTileExplorationStatus(args)

  // Update images for explored tiles
  const allTiles = await queryDocs("mapTiles", (ref) =>
    ref.where("gameId", "==", args.game.uid)
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
        (message) =>
          !tile.lastImageGeneratedAt ||
          message.createdAt > tile.lastImageGeneratedAt
      )

      const wasExploredThisRound =
        tile.exploredInRoundId === args?.currentRound?.uid

      const wasExploredThisRoundAndNotGenerated =
        wasExploredThisRound && !tile.lastImageGeneratedAt

      if (
        messagesSinceLastPrompt.length === 0 &&
        !wasExploredThisRoundAndNotGenerated
      ) {
        return
      }

      const prompt = getTileMetadataPrompt(messagesSinceLastPrompt, tile, args)

      const metadataCompletion = await openAiClient.beta.chat.completions.parse(
        {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are an expert at describing environments concisely and creating effective DALL-E prompts.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: zodResponseFormat(TileMetadata, "tileMetadata"),
          temperature: 0.7,
        }
      )

      const { title, description, dallePrompt } =
        metadataCompletion.choices[0].message.parsed

      console.log("map dall-e prompt", dallePrompt)

      // Generate image with DALL-E 3
      const imageUrl = await generateWithGetImage(dallePrompt)

      const storedImageUrl = await uploadImageToStorage(
        imageUrl,
        args.game.uid,
        path.join("tiles", `${tile.position.x}_${tile.position.y}.jpg`)
      )

      // Update tile with new image and metadata
      await fbSet("mapTiles", tile.uid, {
        ...tile,
        imageUrl: storedImageUrl,
        lastImageGeneratedAt: backendNow(),
        previousDallePrompt: dallePrompt,
        title,
        description,
      })
    })
  )
}
