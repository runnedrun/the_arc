import { getOpenAIClient } from "../../helpers/getOpenAIClient"
import { ChatCompletionMessageParam } from "openai/resources"
import { fbCreate } from "../../helpers/writer"
import { GameProcessingArgs } from "../processGame/getGameData"
import { getMessagesForTiles } from "./getMessagesForTiles"

const MAX_MESSAGE_LENGTH = 150

export const generateElderCouncilResponse = async ({
  tileMessages,
  elderCouncilDecrees,
  tileHistory,
}: {
  tileMessages: any[]
  elderCouncilDecrees: any[]
  tileHistory: any[]
}) => {
  const openai = getOpenAIClient()

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are the Elder Council, a powerful governing body in the valley. Review the recent actions on this tile and determine if intervention is needed based on your previous decrees. If intervention is needed, generate a single action (max ${MAX_MESSAGE_LENGTH} characters) written in third person. If no action is needed, respond with exactly "NO ACTION".`,
    },
    {
      role: "user",
      content: `
Recent actions on this tile: ${tileMessages.map((m) => m.content).join("\n")}
Tile history: ${tileHistory.map((h) => h.entryText).join("\n")}
Your previous decrees: ${elderCouncilDecrees.map((d) => d.content).join("\n")}

Based on these actions and your previous decrees, determine if intervention is needed. Respond with an action (max ${MAX_MESSAGE_LENGTH} characters) or "NO ACTION".`,
    },
  ]

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    max_tokens: 60,
    temperature: 0.7,
  })

  const response = completion.choices[0].message.content?.trim() || "NO ACTION"
  return response === "NO ACTION" ? null : response.slice(0, MAX_MESSAGE_LENGTH)
}

export const generateElderCouncilTileActions = async ({
  currentRound,
  elderCouncilDecrees,
  mapTiles,
  game,
}: GameProcessingArgs) => {
  const messagesGroupedByTile = getMessagesForTiles(currentRound.uid)

  // Process each tile that has messages
  const councilActions = await Promise.all(
    Object.entries(messagesGroupedByTile).map(
      async ([tileLocationStr, messages]) => {
        const tileLocation = JSON.parse(tileLocationStr)
        const tile = mapTiles.find(
          (t) =>
            t.position.x === tileLocation.x && t.position.y === tileLocation.y
        )

        if (!tile) return null

        // Generate council response based on tile activity
        const councilResponse = await generateElderCouncilResponse({
          tileMessages: messages,
          elderCouncilDecrees,
          tileHistory: tile.history,
        })

        if (!councilResponse) return null

        // Create a new message from the elder council
        await fbCreate("messages", {
          receiverId: null,
          content: councilResponse,
          senderId: "elderCouncil",
          tileLocation,
          roundId: currentRound.uid,
          roundIndex: currentRound.index,
          gameId: game.uid,
          type: "tile",
          processedAt: null,
        })

        return councilResponse
      }
    )
  )

  return councilActions.filter(Boolean)
}
