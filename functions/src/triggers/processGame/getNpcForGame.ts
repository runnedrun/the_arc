import { GameProcessingArgs } from "./getGameData"
import { getOpenAIClient } from "../../helpers/getOpenAIClient"
import { z } from "zod"
import { zodResponseFormat } from "openai/helpers/zod"
import { NPC, getNpcId } from "@/data/types/NPC"
import { fbCreate } from "../../helpers/writer"
import { MapPosition } from "@/data/types/MapTile"
import { setupCharacterImage } from "../../helpers/setupCharacterImage"

const NPCSchema = z.object({
  name: z.string(),
  personality: z.string(),
})

const getPrompt = (args: GameProcessingArgs) => {
  const existingPersonalities = [
    ...args.npcs.map((npc) => npc.personality),
    ...args.players.map((player) => player.playerPersonality),
  ].filter(Boolean)

  const existingNames = [
    ...args.npcs.map((npc) => npc.name),
    ...args.players.map((player) => player.name),
  ].filter(Boolean)

  return `Create a new NPC for a game set in this world:
${args.game.environmentDescription}

Requirements:
- Generate a unique name that doesn't match any existing names: ${existingNames.join(", ")}
- Create a unique personality that doesn't overlap with existing personalities: ${existingPersonalities.join(", ")}
- The personality should brief, less than 100 characters, and should include a unique, but rather small, motivation or goal they have.
- The name should be world-appropriate but easily pronounceable
- The personality should allow them to have interesting interactions with other characters and meaningfully influence the world's development`
}

export const getNpcForGame = async (
  args: GameProcessingArgs,
  location: MapPosition
) => {
  const openAiClient = getOpenAIClient()

  const completion = await openAiClient.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an expert at creating unique and interesting NPCs for narrative-driven games.",
      },
      {
        role: "user",
        content: getPrompt(args),
      },
    ],
    response_format: zodResponseFormat(NPCSchema, "npc"),
    temperature: 0.8,
  })

  const npcData = completion.choices[0].message.parsed
  const npcId = getNpcId()

  const image = await setupCharacterImage({
    name: npcData.name,
    personality: npcData.personality,
    environmentDescription: args.game.environmentDescription,
    collectionName: "npcs",
    uid: npcId,
    gameId: args.game.uid,
  })

  const npcTileIsExplored = args.mapTiles.some(
    (tile) =>
      tile.position.x === location.x &&
      tile.position.y === location.y &&
      tile.explored
  )

  const npc: NPC = {
    gameId: args.game.uid,
    name: npcData.name,
    personality: npcData.personality,
    letters: 200,
    currentTileLocation: location,
    createdRoundIndex: args.currentRound?.index || null,
    createdRoundId: args.currentRound?.uid || null,
    imageUrl: image,
    active: npcTileIsExplored,
  }

  console.log("creating npc")
  await Promise.all([fbCreate("npcs", npc, { id: npcId })])

  return npc
}
