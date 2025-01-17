import { getOpenAIClient } from "../../helpers/getOpenAIClient"
import { GameProcessingArgs } from "./getGameData"
import { ChatCompletionMessageParam } from "openai/resources/chat/completions"
import { fbSet } from "../../helpers/writer"
import { z } from "zod"
import { zodResponseFormat } from "openai/helpers/zod"
import { setupCharacterImage } from "../../helpers/setupCharacterImage"

const SecretVisionsSchema = z.object({
  playerVisions: z.array(
    z.object({
      playerIndex: z.number(),
      secretVision: z.string(),
    })
  ),
})

const assignSecretVisions = async (args: GameProcessingArgs) => {
  const { game, players } = args
  const openAiClient = getOpenAIClient()

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are an expert at creating balanced and interrelated secret objectives for players in a game. You will create objectives that create interesting dynamics between players while remaining achievable and measurable.`,
    },
    {
      role: "user",
      content: `Create secret objectives for ${players.length} players in this world: ${game.environmentDescription}

The players' personalities are:
${players.map((p, i) => `Player ${i + 1}: ${p.playerPersonality}`).join("\n")}

Requirements for each objective:
- Must be no longer than 2 sentences
- Must be different from other players' objectives
- Should create interesting (but not overwhelming) conflict with other objectives
- Must be measurable by reviewing the history of the world
- Must be achievable through influencing society over 40 years
- Must fit within the world's context
- Objectives should be balanced in difficulty and scope`,
    },
  ]

  const completion = await openAiClient.beta.chat.completions.parse({
    model: "gpt-4o",
    messages,
    response_format: zodResponseFormat(SecretVisionsSchema, "playerVisions"),
    temperature: 0.9,
  })

  await Promise.all(
    completion.choices[0].message.parsed.playerVisions.map(
      async (vision, index) => {
        await fbSet("players", players[index].uid, {
          secretVision: vision.secretVision,
        })
      }
    )
  )
}

const setupPlayerImages = async (args: GameProcessingArgs) => {
  await Promise.all(
    args.players.map(async (player) => {
      const image = await setupCharacterImage({
        name: player.name,
        personality: player.playerPersonality,
        environmentDescription: args.game.environmentDescription,
        collectionName: "players",
        uid: player.uid,
        gameId: args.game.uid,
      })
      await fbSet("players", player.uid, {
        playerImageUrl: image,
      })
    })
  )
}

export const assignPlayerSecretVisionsAndSetupPlayerImages = async (
  args: GameProcessingArgs
) => {
  await Promise.all([assignSecretVisions(args), setupPlayerImages(args)])
}
