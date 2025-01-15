import { getOpenAIClient } from "../../helpers/getOpenAIClient"
import { ChatCompletionMessageParam } from "openai/resources"
import { fbCreate } from "../../helpers/writer"
import { GameProcessingArgs } from "../processGame/getGameData"
import { getMessagesForTiles } from "./getMessagesForTiles"
import { Message } from "@/data/types/Message"
import { getMessageStrings } from "./getTileHistoryMessageStrings"

const generateHistoricalEntry = async ({
  messages,
  players,
}: {
  messages: Message[]
  players: GameProcessingArgs["players"]
}) => {
  const messageStrings = getMessageStrings(messages, players)
  const gptMessages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are an AI Historian documenting the events in this environment, for a game similar to "Civilization". Your role is to:
- Create a 1-2 sentence historical entry based on the actions that occurred
- When actions are in conflict, give more weight to Elder Council actions over player/NPC actions
- Ensure actions respect physical laws and the tile's environment
- If actions are unrealistic or impossible, document the attempt and failure
- Write in past tense, third person, maintaining a historical tone`,
    },
    {
      role: "user",
      content: `
Tile's previous history: ${messageStrings.join("\n")}

Recent actions (Elder Council actions are authoritative):
${messages.map((m) => `${m.senderId === "elderCouncil" ? "[ELDER COUNCIL]" : "[Actor]"}: ${m.content}`).join("\n")}

Write a 1-2 sentence historical entry for this year's events:`,
    },
  ]
  const openAi = getOpenAIClient()

  const completion = await openAi.chat.completions.create({
    model: "gpt-4",
    messages: gptMessages,
    max_tokens: 100,
    temperature: 0.7,
  })

  return completion.choices[0].message.content?.trim()
}

export const addToTileHistory = async ({
  currentRound,
  mapTiles,
  game,
  players,
}: GameProcessingArgs) => {
  const messagesGroupedByTile = await getMessagesForTiles({
    roundId: null,
    gameId: game.uid,
  })

  await Promise.all(
    Object.entries(messagesGroupedByTile).map(
      async ([tileCoordsStr, messages]) => {
        const tileCoords = JSON.parse(tileCoordsStr)
        const tile = mapTiles.find(
          (t) => t.position.x === tileCoords.x && t.position.y === tileCoords.y
        )

        if (!tile) return

        const historyEntry = await generateHistoricalEntry({
          messages,
          players,
        })

        if (historyEntry) {
          console.log("creating tile histor", historyEntry)
          await fbCreate("messages", {
            tileLocation: tile.position,
            gameId: game.uid,
            roundId: currentRound.uid,
            roundIndex: currentRound.index,
            content: historyEntry,
            type: "tileHistory",
            senderId: "elderCouncil",
            receiverId: "player",
            processedAt: null,
          })
        }
      }
    )
  )
}
