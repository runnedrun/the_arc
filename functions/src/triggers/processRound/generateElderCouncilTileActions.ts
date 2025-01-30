import { getOpenAIClient } from "../../helpers/getOpenAIClient"
import { ChatCompletionMessageParam } from "openai/resources"
import { fbCreate } from "../../helpers/writer"
import { GameProcessingArgs } from "../processGame/getGameData"
import { getMessagesForTiles } from "./getMessagesForTiles"
import { getDefaultMessage, Message } from "@/data/types/Message"
import { getMessageStrings } from "./getMessageStrings"

const MAX_MESSAGE_LENGTH = 150

export const generateElderCouncilResponse = async ({
  tileMessages,
  gameArgs,
}: {
  tileMessages: Message[]
  gameArgs: GameProcessingArgs
}) => {
  const openai = getOpenAIClient()

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are the executive branch of the Elder Council, a powerful governing body. Review the recent actions on in thie environment and determine if you need to take action to intervene to uphold your previous decrees. If intervention is needed, generate a single action (max ${MAX_MESSAGE_LENGTH} characters) written in first person (we ...). If no action is needed, respond with exactly "NO ACTION".`,
    },
    {
      role: "user",
      content: `
Recent history of this environment: ${getMessageStrings(
        tileMessages,
        gameArgs,
        {
          emptyMessage: "No history",
        }
      )}
Your previous decrees: ${getMessageStrings(
        gameArgs.elderCouncilDecrees,
        gameArgs,
        {
          emptyMessage: "No decrees",
        }
      )}

Based on these actions and your previous decrees, respond with an action you take (max ${MAX_MESSAGE_LENGTH} characters) or "NO ACTION".`,
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

export const generateElderCouncilTileActions = async (
  args: GameProcessingArgs
) => {
  const messagesGroupedByTile = await getMessagesForTiles({
    roundId: args.currentRound.uid,
    gameId: args.game.uid,
  })

  // Process each tile that has messages
  const councilActions = await Promise.all(
    Object.entries(messagesGroupedByTile).map(
      async ([tileLocationStr, messages]) => {
        const tileLocation = JSON.parse(tileLocationStr)
        const tile = args.mapTiles.find(
          (t) =>
            t.position.x === tileLocation.x && t.position.y === tileLocation.y
        )

        if (!tile) return null

        // Generate council response based on tile activity
        const councilResponse = await generateElderCouncilResponse({
          tileMessages: messages,
          gameArgs: args,
        })

        if (!councilResponse) return null

        // Create a new message from the elder council
        await fbCreate(
          "messages",
          getDefaultMessage({
            receiverId: null,
            content: councilResponse,
            senderId: "elderCouncil",
            tileLocation,
            roundId: args.currentRound.uid,
            roundIndex: args.currentRound.index,
            gameId: args.game.uid,
            type: "tileAction",
            processedAt: null,
          })
        )

        return councilResponse
      }
    )
  )

  return councilActions.filter(Boolean)
}
