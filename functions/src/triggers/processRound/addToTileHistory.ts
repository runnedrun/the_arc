import { getOpenAIClient } from "../../helpers/getOpenAIClient"
import { ChatCompletionMessageParam } from "openai/resources"
import { fbCreate } from "../../helpers/writer"
import { GameProcessingArgs } from "../processGame/getGameData"
import { getMessagesForTiles } from "./getMessagesForTiles"
import { getDefaultMessage, Message } from "@/data/types/Message"
import { getMessageStrings } from "./getMessageStrings"
import { sortBy } from "lodash-es"
import { getEnvironmentContextString } from "../../helpers/getEnvironmentContextString"

const generateHistoricalEntry = async ({
  messages,
  gameArgs,
}: {
  messages: Message[]
  gameArgs: GameProcessingArgs
}) => {
  const messageStrings = getMessageStrings(messages, gameArgs)
  const gptMessages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are an AI Historian documenting the events in ${getEnvironmentContextString(gameArgs.game)}. 

Your role is to:
- Create a 1-2 sentence historical entry based on the actions that occurred
- When actions are in conflict, give more weight to Elder Council actions over player/NPC actions
- Ensure actions respect physical laws and the environment's rules
- If actions are unrealistic or impossible given the environment, document the attempt and failure
- Write in past tense, third person, maintaining a historical tone`,
    },
    {
      role: "user",
      content: `
Tile's previous history up until now: ${messageStrings.join("\n")}

Write a 1-2 sentence historical entry for this year's events:`,
    },
  ]
  const openAi = getOpenAIClient()

  const completion = await openAi.chat.completions.create({
    model: "gpt-4o",
    messages: gptMessages,
    max_tokens: 100,
    temperature: 0.7,
  })

  return completion.choices[0].message.content?.trim()
}

export const addToTileHistory = async (args: GameProcessingArgs) => {
  const { currentRound, mapTiles, game, players } = args

  const messagesGroupedByTile = await getMessagesForTiles({
    roundId: null,
    gameId: game.uid,
  })

  await Promise.all(
    Object.entries(messagesGroupedByTile).map(
      async ([tileCoordsStr, messages]) => {
        const mostRecentMessage = messages[0]
        if (mostRecentMessage.roundId !== currentRound.uid) {
          // this tiles doesn't have any new messsages this round
          return
        }

        const tileCoords = JSON.parse(tileCoordsStr)
        const tile = mapTiles.find(
          (t) => t.position.x === tileCoords.x && t.position.y === tileCoords.y
        )

        const historyEntry = await generateHistoricalEntry({
          messages,
          gameArgs: args,
        })

        if (historyEntry) {
          await fbCreate(
            "messages",
            getDefaultMessage({
              tileLocation: tile.position,
              gameId: game.uid,
              roundId: currentRound.uid,
              roundIndex: currentRound.index,
              content: historyEntry,
              type: "tileHistory",
              senderId: "historian",
              receiverId: null,
              processedAt: null,
            })
          )
        }
      }
    )
  )
}
