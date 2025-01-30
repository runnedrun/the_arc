import { GameProcessingArgs } from "../processGame/getGameData"
import { getOpenAIClient } from "../../helpers/getOpenAIClient"
import { z } from "zod"
import { zodResponseFormat } from "openai/helpers/zod"
import {
  generatePersonalityAndImage,
  setupNPCOnMap,
} from "../processGame/getNpcForGame"
import { sample } from "lodash-es"
import { MapPosition } from "@/data/types/MapTile"
import { getMessageStrings } from "./getMessageStrings"
import { getNpcId } from "@/data/types/NPC"

const LocationSchema = z.object({
  chosenTileTitle: z.string(),
  reasoning: z.string(),
})

const getPrompt = (args: GameProcessingArgs) => {
  const npcLocations = args.npcs.map(
    (npc) =>
      `NPC ${npc.name} (${npc.personality}) is at tile ${npc.currentTileLocation?.x},${npc.currentTileLocation?.y}`
  )

  const tileDescriptions = args.mapTiles.map(
    (tile) => `Title: ${tile.title} 
    Description: ${tile.description}
    `
  )

  const latestDecrees = getMessageStrings(args.elderCouncilDecrees, args, {
    emptyMessage: "No decrees",
  })

  return `As the Elder Council, decide where to place a new NPC in our realm.

Your latest decrees:
${latestDecrees}

Current NPC Locations:
${npcLocations.join("\n")}

Available Tiles:
${tileDescriptions.join("\n")}

Consider the following when choosing a location:
- Your recent decrees and whether placing an npc on a tile would advance them
- Distribution of NPCs across the map
- The environment of each tile and how it might be interesting to the specific NPC
- Potential for interesting interactions
- Balance of population across regions

Having additional npcs on a tile is generally a boon, so you can use it to reward tiles that correspond with your decrees.

Return a JSON object with the title of the chosen tile and your reasoning.`
}

const getTileLocation = async (args: GameProcessingArgs) => {
  const openAiClient = getOpenAIClient()

  // Get location recommendation from Elder Council (GPT-4)
  const completion = await openAiClient.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are the Elder Council, wisely deciding where to place new citizens in the realm.",
      },
      {
        role: "user",
        content: getPrompt(args),
      },
    ],
    response_format: zodResponseFormat(LocationSchema, "location"),
    temperature: 0.7,
  })

  const { chosenTileTitle } = completion.choices[0].message.parsed

  // Find the tile matching the chosen title, or fall back to random tile
  let chosenTile = args.mapTiles.find((tile) => tile.title === chosenTileTitle)
  if (!chosenTile) {
    console.warn(
      `Tile with title "${chosenTileTitle}" not found, falling back to random tile`
    )
    chosenTile = sample(args.mapTiles)
  }

  if (!chosenTile) {
    throw new Error("No valid tiles found for NPC placement")
  }

  const location: MapPosition = {
    x: chosenTile.position.x,
    y: chosenTile.position.y,
  }
  return location
}

export const spawnNewNpc = async (args: GameProcessingArgs) => {
  // Create the new NPC at the chosen location
  const npcId = getNpcId()
  const [location, { name, personality, imageUrl }] = await Promise.all([
    getTileLocation(args),
    generatePersonalityAndImage({
      gameProcessingArgs: args,
      npcId,
    }),
  ])

  const newNpc = await setupNPCOnMap({
    gameProcessingArgs: args,
    location,
    npcId,
    name,
    personality,
    imageUrl,
  })

  return newNpc
}
