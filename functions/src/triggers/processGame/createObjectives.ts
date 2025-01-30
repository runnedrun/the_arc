import { getDefaultMessage } from "@/data/types/Message"
import { sortBy, uniqBy } from "lodash-es"
import { zodResponseFormat } from "openai/helpers/zod"
import { ChatCompletionMessageParam } from "openai/resources"
import { z } from "zod"
import { getOpenAIClient } from "../../helpers/getOpenAIClient"
import { queryDocs } from "../../helpers/reader"
import { fbCreate } from "../../helpers/writer"
import { getMessageStrings } from "../processRound/getMessageStrings"
import { GameProcessingArgs } from "./getGameData"
import { Player } from "@/data/types/Player"
import { getCharacterName } from "@/app/game/[gameId]/getSerializedMessages"

export const SecretVisionsSchema = z.object({
  playerObjectives: z.array(
    z.object({
      playerIndex: z.number(),
      objective: z.string(),
    })
  ),
  publicObjective: z.string(),
})

export const SinglePlayerObjectiveSchema = z.object({
  objective: z.string(),
})

export const createObjectives = async (
  args: GameProcessingArgs,
  forPlayer?: Player
) => {
  const { game, players } = args
  const openAiClient = getOpenAIClient()

  const currentObjectives = await queryDocs("messages", (ref) => {
    return ref
      .where("gameId", "==", game.uid)
      .where("type", "in", ["secretObjective", "publicObjective"])
  })

  const reversedObjectives = sortBy(
    currentObjectives,
    (_) => _.createdAt.toMillis() * -1
  )

  const latestObjectives = uniqBy(reversedObjectives, "receiverId")

  const objectiveMessageStrings = getMessageStrings(latestObjectives, args, {
    emptyMessage: "No objectives",
  })

  const previousObjectivesString =
    objectiveMessageStrings.length > 0
      ? `
The following are the objectives you issued five years ago:
${objectiveMessageStrings}

For these new objectives please build on the previous ones.
`
      : ""

  const requirements = `Requirements for each objective:
- Must be no longer than 2 sentences
- Must be distinct
- Should create interesting (but not overwhelming) conflict with other objectives
- Must be measurable by reviewing the history of the world
- Must be achievable through influencing society over the next 5 years
- Must fit within the world's context
- Objectives should be balanced in difficulty and scope
`

  const createObjectiveForSinglePlayerText = `
Please create one new secret objective for just ${getCharacterName(
    args,
    forPlayer?.uid
  )}:

Here are the objectives for the other players:
${objectiveMessageStrings}
`

  const createObjectivesForAllPlayersText = `
Create one secret objective for each of the${players.length} players in this world, and one public objective for all the players. 
The objectives should be achievable in 5 years (5 game rounds). Mention this frame when creating the objective.`

  const objectiveInstructions = forPlayer
    ? createObjectiveForSinglePlayerText
    : createObjectivesForAllPlayersText

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are an expert at creating balanced and interrelated secret and public objectives for players in a game. You will create objectives that create interesting dynamics between players while remaining achievable and measurable.`,
    },
    {
      role: "user",
      content: `${objectiveInstructions}

#World Description:
${game.environmentDescription}

${previousObjectivesString}

#All players and their personalities:
${players.map((p, i) => `${getCharacterName(args, p.uid)}: ${p.playerPersonality}`).join("\n")}

${requirements}
`,
    },
  ]

  if (forPlayer) {
    const completion = await openAiClient.beta.chat.completions.parse({
      model: "gpt-4o",
      messages,
      response_format: zodResponseFormat(
        SinglePlayerObjectiveSchema,
        "playerVisions"
      ),
      temperature: 0.9,
    })

    // Handle single player objective
    await fbCreate(
      "messages",
      getDefaultMessage({
        roundId: args.currentRound.uid,
        roundIndex: args.currentRound.index,
        content: completion.choices[0].message.parsed.objective,
        receiverId: forPlayer.uid,
        gameId: game.uid,
        type: "secretObjective",
      })
    )
  } else {
    const completion = await openAiClient.beta.chat.completions.parse({
      model: "gpt-4o",
      messages,
      response_format: zodResponseFormat(SecretVisionsSchema, "playerVisions"),
      temperature: 0.9,
    })

    // Handle multiple player objectives
    await Promise.all(
      completion.choices[0].message.parsed.playerObjectives.map(
        async (objective) => {
          await fbCreate(
            "messages",
            getDefaultMessage({
              roundId: args.currentRound.uid,
              roundIndex: args.currentRound.index,
              content: objective.objective,
              receiverId: players[objective.playerIndex - 1].uid,
              gameId: game.uid,
              type: "secretObjective",
            })
          )
        }
      )
    )

    await fbCreate(
      "messages",
      getDefaultMessage({
        content: completion.choices[0].message.parsed.publicObjective,
        type: "publicObjective",
        gameId: game.uid,
        roundId: args.currentRound.uid,
        roundIndex: args.currentRound.index,
      })
    )
  }
}
