import { ModelBase } from "@/data/baseTypes/Model"
import { Message } from "@/data/types/Message"
import { idIsNpc } from "@/data/types/NPC"
import { getOpenAIClient } from "@/functions/src/helpers/getOpenAIClient"
import { getBeAppNext } from "@/functions/src/helpers/initAppNextBackend"
import { queryDocs, readDoc } from "@/functions/src/helpers/reader"
import { backendNow, fbCreate, fbUpdate } from "@/functions/src/helpers/writer"
import { getGameData } from "@/functions/src/triggers/processGame/getGameData"
import { getMessageStringsZipped } from "@/functions/src/triggers/processRound/getMessageStrings"
import { NextApiRequest, NextApiResponse } from "next"
import { NextRequest, NextResponse } from "next/server"
import { ChatCompletionMessageParam } from "openai/resources"

export type ProcessMessageArgs = {
  messageId: string
}

export async function POST(req: NextRequest) {
  const openai = getOpenAIClient()

  getBeAppNext()

  const { messageId } = (await req.json()) as ProcessMessageArgs

  await fbUpdate("messages", messageId, {
    processingStartedAt: backendNow(),
  })

  // Get the message using readDoc instead of direct Firestore access
  const message = await readDoc("messages", messageId)

  if (!(message.type === "elderCouncil" || message.type == "npc")) {
    return NextResponse.json({ success: true })
  }

  // Get conversation messages using queryDocs
  const conversationMessages = await queryDocs("messages", (ref) =>
    ref
      .where("gameId", "==", message.gameId)
      .where("receiverId", "==", message.receiverId)
      .orderBy("createdAt", "asc")
  )

  // Filter processed messages
  const messagesToProcess = conversationMessages.filter(
    (msg) => msg.processingTriggeredAt
  )

  // Get game data
  const gameData = await getGameData(message.gameId)

  // Create reply message using fbCreate
  const replyMessage: Omit<Message, keyof ModelBase> = {
    draft: false,
    gameId: message.gameId,
    roundId: message.roundId,
    senderId: message.receiverId,
    receiverId: message.senderId,
    content: "",
    tileLocation: message.tileLocation,
    roundIndex: message.roundIndex,
    type: message.type,
    processingTriggeredAt: backendNow(),
    processingStartedAt: backendNow(),
    processedAt: null,
  }

  const replyRef = await fbCreate("messages", replyMessage)

  // Get message strings
  const messageStrings = getMessageStringsZipped(messagesToProcess, gameData)

  // Prepare system prompt
  const messageStructurePrompt = `Even though the message inputs have labels for sender, year, etc, your reply must be ONLY the message with no preamble or label. 
Your mesage to the player:`

  let systemPrompt = ""
  if (message.receiverId === "elderCouncil") {
    systemPrompt = `You are the governing Council of ${gameData.game.environmentName}, a game world. 
      The world you exist in:
      ${gameData.game.environmentDescription}
      You are talking with a player in this game world. You talk to them once a year.
      Respond briefly and authoritatively, in no more than 2 sentences.`
  } else {
    const npc = gameData.npcs.find((n) => n.uid === message.receiverId)
    if (!npc) throw new Error("NPC not found")

    systemPrompt = `You are ${npc.name}, a character in the game world ${gameData.game.environmentName}.
      Your personality:
      ${npc.personality}

      The game world you exist in:      
      ${gameData.game.environmentDescription}

      You are talking to a player in this world. You talk to them once a year.`
  }

  const gptMessages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...messageStrings.map(
      (item) =>
        ({
          role:
            idIsNpc(message.receiverId) ||
            item.message.receiverId === "elderCouncil"
              ? "assistant"
              : "user",
          content: item.stringMessage,
        }) as ChatCompletionMessageParam
    ),
    { role: "system", content: messageStructurePrompt },
  ]

  // Get AI response
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: gptMessages,
  })

  const responseContent = completion.choices[0].message.content || ""

  // Update messages using fbUpdate
  await fbUpdate("messages", replyRef.id, {
    content: responseContent,
    processedAt: backendNow(),
  })

  console.log("updated message", replyRef.id, responseContent)

  await fbUpdate("messages", messageId, {
    processedAt: backendNow(),
  })

  return NextResponse.json({ success: true })
}
