import { GameProcessingArgs } from "../processGame/getGameData"
import { queryDocs } from "../../helpers/reader"
import { fbCreate } from "../../helpers/writer"
import { ChatCompletionMessageParam } from "openai/resources"
import { getOpenAIClient } from "../../helpers/getOpenAIClient"
import { NPC } from "@/data/types/NPC"
import { Message } from "@/data/types/Message"
import { MapTile } from "@/data/types/MapTile"

const MAX_MESSAGE_LENGTH = 150
const MAX_HISTORY_MESSAGES = 40

const generateNPCMessage = async ({
  npc,
  npcMessages,
  elderCouncilDecrees,
  currentTile,
  previousActions,
}: {
  npc: NPC
  npcMessages: Message[]
  elderCouncilDecrees: Message[]
  currentTile: MapTile
  previousActions: Message[]
}) => {
  const openai = getOpenAIClient()

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are ${npc.name}, a member of the valley. Generate a realistic action (max ${MAX_MESSAGE_LENGTH} characters) that you would take on your current tile, based on your previous interactions and the tile's history. The action should be written in third person. 
      Your action could also include moving to a different tile, but you must describe the kind of of tile you want to move to, using information from the elder council to determine what kind of tiles exist.`,
    },
    {
      role: "user",
      content: `
Recent messages to you by your tribe leader: ${npcMessages.map((m) => m.content).join("\n")}
Recent tile history: ${currentTile.history.map((m) => m.entryText).join("\n")}
Recent Elder Council decrees and announcements: ${elderCouncilDecrees.map((m) => m.content).join("\n")}
Recent actions you took: ${previousActions.map((m) => m.content).join("\n")}
Generate a single action that you would take, written in third person, max ${MAX_MESSAGE_LENGTH} characters.`,
    },
  ]

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    max_tokens: 60,
    temperature: 0.7,
  })

  const generatedMessage = completion.choices[0].message.content || ""
  return generatedMessage.slice(0, MAX_MESSAGE_LENGTH)
}

export const generateMessagesForAllNPCs = async (args: GameProcessingArgs) => {
  const { game, currentRound, elderCouncilDecrees, mapTiles, npcs } = args

  const npcProcessingComplete = await Promise.all(
    npcs.map(async (npc) => {
      // Run all queries in parallel
      const [npcMessages, previousActions] = await Promise.all([
        queryDocs("messages", (ref) =>
          ref
            .where("receiverId", "==", npc.uid)
            .orderBy("createdAt", "desc")
            .limit(MAX_HISTORY_MESSAGES)
        ),

        queryDocs("messages", (ref) =>
          ref
            .where("senderId", "==", npc.uid)
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
        elderCouncilDecrees,
        currentTile,
        previousActions,
      })

      // Save the generated message
      await fbCreate("messages", {
        receiverId: null,
        content: message,
        senderId: npc.uid,
        tileLocation: npc.currentTileLocation,
        roundId: currentRound.uid,
        roundIndex: currentRound.index,
        gameId: game.uid,
        type: "tile",
        processedAt: null,
      })

      return message
    })
  )

  return npcProcessingComplete
}
