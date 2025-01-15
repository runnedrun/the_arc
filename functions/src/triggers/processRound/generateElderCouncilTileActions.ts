import { getOpenAIClient } from "../../helpers/getOpenAIClient"
import { ChatCompletionMessageParam } from "openai/resources"
import { fbCreate } from "../../helpers/writer"
import { GameProcessingArgs } from "../processGame/getGameData"
import { getMessagesForTiles } from "./getMessagesForTiles"
import { Message } from "@/data/types/Message"
import { getMessageStrings } from "./getTileHistoryMessageStrings"

const MAX_MESSAGE_LENGTH = 150

export const generateElderCouncilResponse = async ({
  tileMessages,
  elderCouncilDecrees,
  players,
}: {
  tileMessages: Message[]
  elderCouncilDecrees: Message[]
  players: GameProcessingArgs["players"]
}) => {
  const openai = getOpenAIClient()

  const tileHistory = await getMessageStrings(tileMessages, players)

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are the Elder Council, a powerful governing body in the valley. Review the recent actions on this tile and determine if intervention is needed based on your previous decrees. If intervention is needed, generate a single action (max ${MAX_MESSAGE_LENGTH} characters) written in third person. If no action is needed, respond with exactly "NO ACTION".`,
    },
    {
      role: "user",
      content: `
Recent actions and results on this tile: ${getMessageStrings(tileMessages, players).join("\n")}
Your previous decrees: ${getMessageStrings(elderCouncilDecrees, players).join("\n")}

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
  players,
}: GameProcessingArgs) => {
  const messagesGroupedByTile = await getMessagesForTiles({
    roundId: currentRound.uid,
    gameId: game.uid,
  })

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
          players,
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
          type: "tileAction",
          processedAt: null,
        })

        return councilResponse
      }
    )
  )

  return councilActions.filter(Boolean)
}
