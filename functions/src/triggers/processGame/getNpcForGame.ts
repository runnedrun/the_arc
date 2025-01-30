import { GameProcessingArgs } from "./getGameData"
import { getOpenAIClient } from "../../helpers/getOpenAIClient"
import { z } from "zod"
import { zodResponseFormat } from "openai/helpers/zod"
import { NPC, getNpcId } from "@/data/types/NPC"
import { fbCreate } from "../../helpers/writer"
import { MapPosition } from "@/data/types/MapTile"
import { setupCharacterImage } from "../../helpers/setupCharacterImage"
import { isNil } from "lodash-es"
import { getDefaultMessage } from "@/data/types/Message"

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

export const generatePersonalityAndImage = async (args: {
  gameProcessingArgs: GameProcessingArgs
  npcId: string
}) => {
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
        content: getPrompt(args.gameProcessingArgs),
      },
    ],
    response_format: zodResponseFormat(NPCSchema, "npc"),
    temperature: 0.8,
  })

  const npcData = completion.choices[0].message.parsed

  const image = await setupCharacterImage({
    name: npcData.name,
    personality: npcData.personality,
    environmentDescription: args.gameProcessingArgs.game.environmentDescription,
    collectionName: "npcs",
    uid: args.npcId,
    gameId: args.gameProcessingArgs.game.uid,
  })

  return {
    ...npcData,
    imageUrl: image,
  }
}

export const setupNPCOnMap = async (args: {
  gameProcessingArgs: GameProcessingArgs
  location: MapPosition
  npcId: string
  name: string
  personality: string
  imageUrl: string
  forceActive?: boolean
}) => {
  const npcTileIsExplored = args.gameProcessingArgs.mapTiles.some(
    (tile) =>
      tile.position.x === args.location.x &&
      tile.position.y === args.location.y &&
      tile.explored
  )

  const npc: NPC = {
    gameId: args.gameProcessingArgs.game.uid,
    name: args.name,
    personality: args.personality,
    letters: 200,
    currentTileLocation: args.location,
    createdRoundIndex: isNil(args.gameProcessingArgs.currentRound?.index)
      ? null
      : args.gameProcessingArgs.currentRound?.index,
    createdRoundId: isNil(args.gameProcessingArgs.currentRound?.uid)
      ? null
      : args.gameProcessingArgs.currentRound?.uid,
    imageUrl: args.imageUrl,
    active: args.forceActive || npcTileIsExplored,
  }

  await Promise.all([
    fbCreate("npcs", npc, { id: args.npcId }),
    fbCreate(
      "messages",
      getDefaultMessage({
        senderId: args.npcId,
        roundId: isNil(args.gameProcessingArgs.currentRound?.uid)
          ? null
          : args.gameProcessingArgs.currentRound?.uid,
        roundIndex: isNil(args.gameProcessingArgs.currentRound?.index)
          ? null
          : args.gameProcessingArgs.currentRound?.index,
        tileLocation: args.location,
        content: `${npc.name} entered tile`,
        gameId: args.gameProcessingArgs.game.uid,
        type: "tileMovement",
      })
    ),
  ])

  return npc
}

export const getNpcForGame = async (
  args: GameProcessingArgs,
  location: MapPosition,
  forceActive = false
) => {
  const npcId = getNpcId()
  const { name, personality, imageUrl } = await generatePersonalityAndImage({
    gameProcessingArgs: args,
    npcId,
  })

  return setupNPCOnMap({
    gameProcessingArgs: args,
    location,
    npcId,
    name,
    personality,
    imageUrl,
    forceActive,
  })
}
