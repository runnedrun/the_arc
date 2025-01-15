import { z } from "zod"
import { getOpenAIClient } from "../../helpers/getOpenAIClient"
import { ChatCompletionMessageParam } from "openai/resources"
import { fbCreate } from "../../helpers/writer"
import { GameProcessingArgs } from "../processGame/getGameData"
import { getMessagesForTiles } from "./getMessagesForTiles"
import { getMessageStrings } from "./getTileHistoryMessageStrings"
import { Dictionary } from "lodash"
import { Message } from "@/data/types/Message"

const DecreesSchema = z.object({
  newDecrees: z.array(z.string()),
})

const getMessageStringsGroupedByTile = (
  messages: Dictionary<Message[]>,
  players: GameProcessingArgs["players"]
) => {
  return Object.entries(messages)
    .map(([tileCoords, tileMessages]) => {
      const tileHistory = getMessageStrings(tileMessages, players)

      return `Tile ${tileCoords}:
    ${tileHistory.join("\n")}
  `
    })
    .join("/n")
}

async function generateRecap({
  currentRound,
  game,
  players,
  elderCouncilDecrees,
}: GameProcessingArgs) {
  const openai = getOpenAIClient()
  const newHistoryEntriesFromThisRound = await getMessagesForTiles({
    roundId: currentRound.uid,
    gameId: game.uid,
  })

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
${getMessageStringsGroupedByTile(newHistoryEntriesFromThisRound, players)}

Provide a single sentence recap focusing on notable events and their relationship to our decrees, if there are any.`,
    },
  ]

  console.log(recapMessages)

  const recapCompletion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: recapMessages,
    max_tokens: 100,
    temperature: 0.7,
  })

  const recap = recapCompletion.choices[0].message.content?.trim() || ""

  await fbCreate("messages", {
    gameId: game.uid,
    roundId: currentRound.uid,
    roundIndex: currentRound.index,
    senderId: "elderCouncil",
    receiverId: null,
    content: recap,
    type: "recap",
    processedAt: null,
    tileLocation: null,
  })

  return recap
}

async function generateNewDecrees({
  currentRound,
  game,
  elderCouncilMessages,
  players,
}: GameProcessingArgs) {
  const openai = getOpenAIClient()
  const decreeMessages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are the Elder Council in a game like Civilization. Your job is to make fair decrees (laws) based on requests from the players. Do your best to make decrees that follow what users request, as long as the user justifies the request. 
        Return a JSON object with 'newDecrees' array. Each decree should be 1-2 sentences. Return empty array if there are no new, clear, requests since your last decree.`,
    },
    {
      role: "user",
      content: `
Here is the history of council requests and decisions:
${getMessageStrings(elderCouncilMessages, players).join("\n")}

If requests are in conflict with each other or existing decrees, make a based on the reasoning provided by the players, using your judgement.

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

  console.log(decreeCompletion.choices[0].message.content)

  const parsedDecrees = DecreesSchema.parse(
    JSON.parse(
      decreeCompletion.choices[0].message.content || '{"newDecrees": []}'
    )
  )

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

  return parsedDecrees.newDecrees
}

export const generateElderCouncilMessages = async (
  args: GameProcessingArgs
) => {
  const [recap, newDecrees] = await Promise.all([
    generateRecap(args),
    generateNewDecrees(args),
  ])

  return {
    recap,
    newDecrees,
  }
}
