import { groupBy, last, sortBy } from "lodash-es"
import { queryDocs } from "../../helpers/reader"
import { GameProcessingArgs } from "../processGame/getGameData"
import { Message } from "@/data/types/Message"
import { getMessageStrings } from "./getMessageStrings"
import { getEnvironmentContextString } from "../../helpers/getEnvironmentContextString"
import { zodResponseFormat } from "openai/helpers/zod"
import { getOpenAIClient } from "../../helpers/getOpenAIClient"
import { fbSet, fbCreate } from "../../helpers/writer"
import { getDefaultMessage } from "@/data/types/Message"
import { backendNow } from "../../helpers/writer"
import { z } from "zod"

const ObjectiveScoring = z.object({
  publicObjectiveWinnerIndex: z.number().nullable(),
  secretObjectiveWinnersIndices: z.array(z.number()),
  recap: z.string(),
})

export const scoreCurrentObjectives = async (args: GameProcessingArgs) => {
  const publicObjectives = await queryDocs("messages", (ref) => {
    return ref
      .where("gameId", "==", args.game.uid)
      .where("archived", "==", false)
      .where("type", "==", "publicObjective")
  })

  const privateObjectives = await queryDocs("messages", (ref) => {
    return ref
      .where("gameId", "==", args.game.uid)
      .where("archived", "==", false)
      .where("type", "==", "secretObjective")
  })

  const sortedPublicObjectives = sortBy(publicObjectives, "index")
  const sortedPrivateObjectives = sortBy(privateObjectives, "index")

  const currentSecretObjectivesByPlayer = groupBy(
    sortedPrivateObjectives,
    "receiverId"
  )

  const currentSecretObjectiveByPlayer = Object.keys(
    currentSecretObjectivesByPlayer
  ).reduce(
    (acc, playerId) => {
      acc[playerId] = last(currentSecretObjectivesByPlayer[playerId])
      return acc
    },
    {} as Record<string, Message>
  )

  const currentPublicObjective = last(sortedPublicObjectives)

  const tileHistory = await queryDocs("messages", (ref) => {
    return ref
      .where("gameId", "==", args.game.uid)
      .where("archived", "==", false)
      .where("type", "==", "tileHistory")
  })

  const tileHistoryStrings = getMessageStrings(tileHistory, args)

  const gameWorldDescription = getEnvironmentContextString(args.game)

  const players = await queryDocs("players", (ref) => {
    return ref
      .where("gameId", "==", args.game.uid)
      .where("archived", "==", false)
  })

  const playerInfo = players.map((player, index) => ({
    index,
    name: player.name || `Player ${index + 1}`,
    secretObjective:
      currentSecretObjectiveByPlayer[player.uid]?.content || null,
  }))

  const openAiClient = getOpenAIClient()
  const completion = await openAiClient.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are judging a game where players shape the history of a world by influencing different regions (tiles). Each player has a secret objective they're trying to achieve, and there's also a public objective that all players can contribute to. You'll analyze the history of tile changes and determine who best achieved their objectives. Multiple players can achieve their secret objectives simultaneously.`,
      },
      {
        role: "user",
        content: `
Public Objective: ${currentPublicObjective?.content || "No public objective"}

Players and their Secret Objectives:
${playerInfo
  .map((p) => `Player ${p.index} (${p.name}): ${p.secretObjective}`)
  .join("\n")}

Tile History:
${tileHistoryStrings.join("\n")}

Game World Context:
${gameWorldDescription}

Please determine:
1. Which player index (if any) best achieved the public objective
2. Which player indices (can be multiple) achieved their secret objectives
3. Provide a recap explaining the winners without revealing losing players' secret objectives`,
      },
    ],
    response_format: zodResponseFormat(ObjectiveScoring, "scoring"),
    temperature: 0.7,
  })

  const { publicObjectiveWinnerIndex, secretObjectiveWinnersIndices, recap } =
    completion.choices[0].message.parsed

  // Update player scores
  if (publicObjectiveWinnerIndex !== null) {
    const winner = players[publicObjectiveWinnerIndex]
    await fbSet("players", winner.uid, {
      publicObjectivePoints: (winner.publicObjectivePoints || 0) + 1,
      publicObjectivesScored: [
        ...(winner.publicObjectivesScored || []),
        currentPublicObjective?.uid || "",
      ],
    })
  }

  // Update secret objective winners
  await Promise.all(
    secretObjectiveWinnersIndices.map((winnerIndex) => {
      const winner = players[winnerIndex]
      const secretObjective = currentSecretObjectiveByPlayer[winner.uid]
      return fbSet("players", winner.uid, {
        secretObjectivePoints: (winner.secretObjectivePoints || 0) + 1,
        secretObjectivesScored: [
          ...(winner.secretObjectivesScored || []),
          secretObjective?.uid || "",
        ],
      })
    })
  )

  // Create recap message
  const recapMessage = getDefaultMessage({
    content: recap,
    type: "recap",
    gameId: args.game.uid,
    roundId: args.currentRound?.uid || null,
    roundIndex: args.currentRound?.index || 0,
    senderId: "elderCouncil",
    receiverId: null,
    processedAt: backendNow(),
  })

  await fbCreate("messages", recapMessage)
}
