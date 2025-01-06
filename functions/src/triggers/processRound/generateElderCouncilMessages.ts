import { z } from "zod"
import { getOpenAIClient } from "../../helpers/getOpenAIClient"
import { ChatCompletionMessageParam } from "openai/resources"
import { fbCreate } from "../../helpers/writer"
import { GameProcessingArgs } from "../processGame/getGameData"
import { getMessagesForTiles } from "./getMessagesForTiles"

const DecreesSchema = z.object({
  newDecrees: z.array(z.string()),
})

export const generateElderCouncilMessages = async ({
  mapTiles,
  currentRound,
  game,
  elderCouncilDecrees,
}: GameProcessingArgs) => {
  const openai = getOpenAIClient()

  // Get new history entries from this round
  const newHistoryEntriesFromThisRound = await getMessagesForTiles(
    currentRound.uid
  )
  const allNewEntries = Object.values(newHistoryEntriesFromThisRound).flat()

  // Generate round recap
  const recapMessages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are the Elder Council's scribe. Create a single sentence recap of the notable events in the valley this round, focusing on activities that align with or contradict the council's decrees.",
    },
    {
      role: "user",
      content: `
Previous decrees: ${elderCouncilDecrees.map((d) => d.content).join("\n")}

New events this round:
${allNewEntries.map((entry) => entry.content).join("\n")}

Provide a single sentence recap focusing on notable events and their relationship to our decrees.`,
    },
  ]

  const recapCompletion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: recapMessages,
    max_tokens: 100,
    temperature: 0.7,
  })

  // Publish recap message
  await fbCreate("messages", {
    gameId: game.uid,
    roundId: currentRound.uid,
    roundIndex: currentRound.index,
    senderId: "elderCouncil",
    receiverId: null,
    content: recapCompletion.choices[0].message.content?.trim() || "",
    type: "elderCouncil",
    processedAt: null,
    tileLocation: null,
  })

  // Generate new decrees
  const decreeMessages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are the Elder Council. Based on recent events, determine if new decrees are needed. Return a JSON object with 'newDecrees' array. Each decree should be 1-2 sentences. Return empty array if no new decrees are needed.",
    },
    {
      role: "user",
      content: `
Current decrees: ${elderCouncilDecrees.map((d) => d.content).join("\n")}

Recent events:
${allNewEntries.map((entry) => entry.content).join("\n")}

Return a JSON object with any new decrees needed to address these events. Format: { "newDecrees": ["decree 1", "decree 2"] }`,
    },
  ]

  const decreeCompletion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: decreeMessages,
    max_tokens: 200,
    temperature: 0.7,
    response_format: { type: "json_object" },
  })

  const parsedDecrees = DecreesSchema.parse(
    JSON.parse(
      decreeCompletion.choices[0].message.content || '{"newDecrees": []}'
    )
  )

  // Publish new decrees as separate messages
  await Promise.all(
    parsedDecrees.newDecrees.map((decree) =>
      fbCreate("messages", {
        gameId: game.uid,
        roundId: currentRound.uid,
        roundIndex: currentRound.index,
        senderId: "elderCouncil",
        receiverId: null,
        content: decree,
        type: "elderCouncil",
        processedAt: null,
        tileLocation: null,
      })
    )
  )

  return {
    recap: recapCompletion.choices[0].message.content,
    newDecrees: parsedDecrees.newDecrees,
  }
}
