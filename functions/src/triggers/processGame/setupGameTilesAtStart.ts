import { Game } from "@/data/types/Game"
import { queryDocs } from "../../helpers/reader"
import OpenAI from "openai"
import { defineString } from "firebase-functions/params"
import { zodResponseFormat } from "openai/helpers/zod"
import { z } from "zod"
import { sampleTileDescriptions } from "../../mocks/sampleTileDescriptions"
import { sampleTileSVGs } from "../../mocks/sampleTileSVGs"
import { isDemoMode } from "../../helpers/isDemoMode"
import { backendNow, fbCreate, fbSet } from "../../helpers/writer"
import { GameProcessingArgs } from "./getGameData"
import { getOpenAIClient } from "../../helpers/getOpenAIClient"
import { MapTile } from "@/data/types/MapTile"
import { Message } from "@/data/types/Message"
import { Timestamp } from "firebase-admin/firestore"

const TileDescriptions = z.object({
  tiles: z.array(
    z.object({
      posX: z.number(),
      posY: z.number(),
      description: z.string(),
    })
  ),
})

const SVGResponses = z.object({
  tileSVGs: z.array(
    z.object({
      posX: z.number(),
      posY: z.number(),
      svg: z.string(),
    })
  ),
})

const getPrompt = (
  sizeOfGrid: number
) => `Design a ${sizeOfGrid}x${sizeOfGrid} valley map where each tile is 3km square. Create a coherent geographical layout where each tile's environment makes sense given its surrounding tiles.

Consider:
- Rivers and water bodies
- Mountains and elevation changes
- Forests and vegetation types
- Natural landmarks

Ensure environments transition logically between adjacent tiles.`

const getSVGsPrompt = (
  tiles: Array<{ posX?: number; posY?: number; description?: string }>
) => {
  const tileList = tiles
    .map((t) => `Tile (${t.posX},${t.posY}): ${t.description}`)
    .join("\n")

  return `Create simple SVG representations for these connected environments:

${tileList}

Requirements for each SVG:
- Use basic shapes and paths
- Be minimalistic but recognizable
- Use appropriate colors
- Fit within a 100x100 viewBox
- Include only essential visual elements
- Ensure visual consistency between adjacent tiles
- Use similar style and scale across all tiles`
}

export const setupGameTilesAtStart = async ({ game }: GameProcessingArgs) => {
  const openAiClient = getOpenAIClient()

  let tileDescriptions = sampleTileDescriptions.tiles

  if (!isDemoMode()) {
    const completion = await openAiClient.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a skilled cartographer and environmental designer.",
        },
        {
          role: "user",
          content: getPrompt(game.mapSize),
        },
      ],
      response_format: zodResponseFormat(TileDescriptions, "tiles"),
      temperature: 0.7,
    })

    tileDescriptions = completion.choices[0].message.parsed
      .tiles as typeof tileDescriptions
  }

  // Generate all SVGs in a single call

  let svgResults = sampleTileSVGs.tileSVGs

  if (!isDemoMode()) {
    const svgCompletion = await openAiClient.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a skilled SVG artist specializing in creating cohesive map tile sets.",
        },
        {
          role: "user",
          content: getSVGsPrompt(tileDescriptions),
        },
      ],
      response_format: zodResponseFormat(SVGResponses, "tileSVGs"),
      temperature: 0.7,
    })

    svgResults = svgCompletion.choices[0].message.parsed
      .tileSVGs as typeof svgResults
  }

  const currentTiles = await queryDocs("mapTiles", (ref) => {
    return ref.where("gameId", "==", game.uid).where("archived", "==", false)
  })

  // Combine the descriptions and SVGs
  return await Promise.all(
    tileDescriptions.map(async (tile) => {
      const existingTile = currentTiles.find(
        (t) => t.position.x === tile.posX && t.position.y === tile.posY
      )

      if (existingTile) {
        const newTile: MapTile = {
          ...existingTile,
          svg:
            svgResults?.find(
              (svg) => svg.posX === tile.posX && svg.posY === tile.posY
            )?.svg || null,
        }
        const newMessageForTileHistory: Message = {
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

        await fbCreate("messages", newMessageForTileHistory)
        await fbSet("mapTiles", existingTile.uid, newTile)
        return newTile
      }
    })
  )
}
