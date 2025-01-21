import { GameProcessingArgs } from "../processGame/getGameData"
import { queryDocs } from "../../helpers/reader"
import { fbCreate } from "../../helpers/writer"
import { ChatCompletionMessageParam } from "openai/resources"
import { getOpenAIClient } from "../../helpers/getOpenAIClient"
import { NPC } from "@/data/types/NPC"
import { getDefaultMessage, Message } from "@/data/types/Message"
import { MapTile } from "@/data/types/MapTile"
import { getMessageStrings } from "./getMessageStrings"
import { getEnvironmentContextString } from "../../helpers/getEnvironmentContextString"

const MAX_MESSAGE_LENGTH = 150
const MAX_HISTORY_MESSAGES = 40

const generateNPCMessage = async ({
  npc,
  npcMessages,
  currentTile,
  gameArgs,
}: {
  npc: NPC
  npcMessages: Message[]
  currentTile: MapTile
  gameArgs: GameProcessingArgs
}) => {
  const { game, elderCouncilDecrees } = gameArgs
  const openai = getOpenAIClient()

  const currentTileMessages = await queryDocs("messages", (ref) =>
    ref
      .where("tileLocation.x", "==", currentTile.position.x)
      .where("tileLocation.y", "==", currentTile.position.y)
      .where("archived", "==", false)
      .orderBy("createdAt", "desc")
      .limit(MAX_HISTORY_MESSAGES)
  )
  const allMessagesToDisplay = [...npcMessages, ...currentTileMessages]

  const tileHistory = getMessageStrings(allMessagesToDisplay, gameArgs, npc.uid)

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are ${npc.name}, living in this world: ${getEnvironmentContextString(game)}. 

Generate a realistic action (max ${MAX_MESSAGE_LENGTH} characters) that you would take on your current tile, based on your previous interactions and the tile's history. The action should be written in third person and must be possible within the established environment. 

Your action could also include moving to a different tile, but you must describe the direction you want to move in: north, south, east, west and the reason for why you're moving— but unless you've been there before, you don't know what's in that direction.`,
    },
    {
      role: "system",
      content: `You have the following personality:
       ${npc.personality}`,
    },
    {
      role: "system",
      content: `
History of this tile and your interactions: ${tileHistory.join("\n")}
Elder Council decrees: ${elderCouncilDecrees.map((m) => m.content).join("\n")}
Generate a single action that you would take, written first person, max ${MAX_MESSAGE_LENGTH} characters.`,
    },
  ]

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    max_tokens: 60,
    temperature: 0.7,
  })

  const generatedMessage = completion.choices[0].message.content || ""

  return generatedMessage.slice(0, MAX_MESSAGE_LENGTH)
}

export const generateMessagesForAllNPCs = async (args: GameProcessingArgs) => {
  const { game, currentRound, mapTiles, npcs } = args

  const activeNpcs = npcs.filter((npc) => npc.active)

  const npcProcessingComplete = await Promise.all(
    activeNpcs.map(async (npc) => {
      // Run all queries in parallel
      const [npcMessages] = await Promise.all([
        queryDocs("messages", (ref) =>
          ref
            .where("receiverId", "==", npc.uid)
            .orderBy("createdAt", "desc")
            .limit(MAX_HISTORY_MESSAGES)
        ),
      ])

      const currentTile = mapTiles.find(
        (tile) =>
          tile.position.x === npc.currentTileLocation.x &&
          tile.position.y === npc.currentTileLocation.y
      )

      // Generate NPC's message using OpenAI
      const message = await generateNPCMessage({
        npc,
        npcMessages,
        currentTile,
        gameArgs: args,
      })

      // Save the generated message
      await fbCreate(
        "messages",
        getDefaultMessage({
          receiverId: null,
          content: message,
          senderId: npc.uid,
          tileLocation: npc.currentTileLocation,
          roundId: currentRound.uid,
          roundIndex: currentRound.index,
          gameId: game.uid,
          type: "tileAction",
          processedAt: null,
        })
      )

      return message
    })
  )

  return npcProcessingComplete
}
