import { Game } from "@/data/types/Game"
import { queryDocs } from "../../helpers/reader"
import { z } from "zod"
import { backendNow, fbCreate, fbSet } from "../../helpers/writer"
import { GameProcessingArgs } from "./getGameData"
import { getOpenAIClient } from "../../helpers/getOpenAIClient"
import { MapTile } from "@/data/types/MapTile"
import { Message } from "@/data/types/Message"
import { zodResponseFormat } from "openai/helpers/zod"
import { sampleTileDescriptions } from "../../mocks/sampleTileDescriptions"
import { isTestMode } from "@/helpers/getUuid"
import { getStorage } from "firebase-admin/storage"
import fetch from "node-fetch"

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
  const completion = await openAiClient.beta.chat.completions.parse({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a skilled cartographer and environmental designer.",
      },
      {
        role: "user",
        content: getInitialPrompt(game.mapSize),
      },
    ],
    response_format: zodResponseFormat(TileDescriptions, "tiles"),
    temperature: 0.7,
  })

  return completion.choices[0].message.parsed.tiles
}

const getTileDescriptions = async (game: Game) => {
  return isTestMode()
    ? sampleTileDescriptions.tiles
    : getTileDescriptionsFromOpenAI(game)
}

const getInitialPrompt = (sizeOfGrid: number) =>
  `Design a ${sizeOfGrid}x${sizeOfGrid} valley map where each tile is 3km square...`
// ... rest of your existing prompt ...

const getDallePrompt = (tileHistory: Message[]) => {
  return `Create a dalle prompt for the current state of this environment, based on the following entries in the environments history:

${tileHistory.map((msg) => `Year ${msg.roundIndex}: ${msg.content}`).join("\n")}

Requirements:
- the image should be in a vector art style
- the image must fill the whole frame, no text, no border
- Show the environment from a slightly elevated angle
- Include appropriate flora, structures, and geographical features`
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

const uploadImageToStorage = async (
  imageUrl: string,
  gameId: string,
  position: { x: number; y: number }
): Promise<string> => {
  // Download image from URL
  const response = await fetch(imageUrl)
  const imageBuffer = await response.buffer()

  // Upload to Firebase Storage
  const storage = getStorage()
  const bucket = storage.bucket()
  const fileName = `games/${gameId}/tiles/${position.x}_${position.y}_${Date.now()}.jpg`
  const fileRef = bucket.file(fileName)

  await fileRef.save(imageBuffer, {
    metadata: {
      contentType: "image/jpeg",
    },
  })

  // Get the public URL
  const [signedUrl] = await fileRef.getSignedUrl({
    action: "read",
    expires: "01-01-2100",
  })

  return signedUrl
}

export const updateGameTiles = async ({ game }: GameProcessingArgs) => {
  const openAiClient = getOpenAIClient()

  // Generate initial descriptions if no tiles exist
  const existingTiles = await queryDocs("mapTiles", (ref) =>
    ref.where("gameId", "==", game.uid).where("archived", "==", false)
  )

  const tileDescriptions = await getTileDescriptions(game)

  if (existingTiles.length === 0) {
    // Create initial tiles
    await Promise.all(
      tileDescriptions.map(async (tile) => {
        const newTile: MapTile = {
          gameId: game.uid,
          position: { x: tile.posX, y: tile.posY },
          explored: false,
          lastImageGeneratedAt: null,
          previousDallePrompt: null,
          imageUrl: null,
        }

        const newMessage: Message = {
          content: tile.description,
          type: "tileHistory",
          tileLocation: { x: tile.posX, y: tile.posY },
          gameId: game.uid,
          roundId: null,
          roundIndex: -1,
          senderId: "tileHistory",
          receiverId: null,
          processedAt: backendNow(),
        }

        await fbCreate("messages", newMessage)
        await fbCreate("mapTiles", newTile)
      })
    )
  }

  await updateTileExplorationStatus(game)

  // Update images for explored tiles
  const allTiles = await queryDocs("mapTiles", (ref) =>
    ref.where("gameId", "==", game.uid).where("archived", "==", false)
  )

  await Promise.all(
    allTiles.map(async (tile) => {
      if (!tile.explored) return

      const tileHistory = await queryDocs("messages", (ref) =>
        ref
          .where("gameId", "==", game.uid)
          .where("type", "==", "tileHistory")
          .where("tileLocation.x", "==", tile.position.x)
          .where("tileLocation.y", "==", tile.position.y)
          .orderBy("processedAt", "asc")
      )

      const latestMessage = tileHistory[tileHistory.length - 1]

      if (
        !latestMessage ||
        (tile.lastImageGeneratedAt &&
          latestMessage.processedAt <= tile.lastImageGeneratedAt)
      ) {
        return
      }

      // Generate DALL-E prompt
      const dallePromptCompletion = await openAiClient.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert at writing prompts for DALL-E 3 that generates an image a setting based on the history of that setting.",
          },
          {
            role: "user",
            content: getDallePrompt(tileHistory),
          },
        ],
        temperature: 0.7,
      })

      const dallePrompt = dallePromptCompletion.choices[0].message.content

      console.log("dallePrompt", dallePrompt)

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
        game.uid,
        tile.position
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
