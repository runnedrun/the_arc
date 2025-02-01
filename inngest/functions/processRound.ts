import { queryDocs } from "@/functions/src/helpers/reader"
import { fbSet } from "@/functions/src/helpers/writer"
import { createObjectives } from "@/functions/src/triggers/processGame/createObjectives"
import {
  GameProcessingArgs,
  getGameData,
} from "@/functions/src/triggers/processGame/getGameData"
import { startNewRound } from "@/functions/src/triggers/processGame/startNewRound"
import { updateGameTiles } from "@/functions/src/triggers/processGame/updateGameTiles"
import { addToTileHistory } from "@/functions/src/triggers/processRound/addToTileHistory"
import { determinePlayerMovement } from "@/functions/src/triggers/processRound/determinePlayerMovement"
import { generateElderCouncilTileActions } from "@/functions/src/triggers/processRound/generateElderCouncilTileActions"
import { generateMessagesForAllNPCs } from "@/functions/src/triggers/processRound/generateMessagesForAllNPCs"
import { objectiveScoringFrequency } from "@/functions/src/triggers/processRound/objectiveScoringFrequency"
import { scoreCurrentObjectives } from "@/functions/src/triggers/processRound/scoreCurrentObjectives"
import { spawnNewNpc } from "@/functions/src/triggers/processRound/spawnNewNpc"
import { Timestamp } from "firebase-admin/firestore"
import { createFunctionForCollection } from "../createFunctionForCollection"
import { inngest } from "../client"
import { createStepTools } from "inngest/components/InngestStepTools"

const updateObjectives = async (args: GameProcessingArgs) => {
  if (
    args.currentRound.index &&
    args.currentRound.index % objectiveScoringFrequency === 0
  ) {
    console.log("Scoring current objectives")
    await fbSet("rounds", args.currentRound.uid, {
      processingState: "Scoring current objectives",
    })
    await scoreCurrentObjectives(args)
    console.log("Creating new objectives")
    await fbSet("rounds", args.currentRound.uid, {
      processingState: "Creating new objectives",
    })
    await createObjectives(args)
  }
}

const spawnNpcs = async (args: GameProcessingArgs) => {
  if (args.currentRound.index % 2 === 1) {
    console.log("Spawning new NPC")
    await fbSet("rounds", args.currentRound.uid, {
      processingState: "Spawning new NPC",
    })
    await spawnNewNpc(args)
  }
}

const runRoundProcessing = async (
  gameId: string,
  step: ReturnType<typeof createStepTools<typeof inngest>>
) => {
  const args = await getGameData(gameId)
  const allPlayersHaveCompletedTheRound = args.players.every(
    (player) => !!args.currentRound.playersCompletedAt?.[player.uid]
  )

  console.log(
    "allPlayersHaveCompletedTheRound",
    allPlayersHaveCompletedTheRound
  )

  if (!allPlayersHaveCompletedTheRound) {
    return
  }

  await fbSet("rounds", args.currentRound.uid, {
    processingStartedAt: Timestamp.now(),
  })

  await step.run("generate-npc-messages", async () => {
    await fbSet("rounds", args.currentRound.uid, {
      processingState: "Determining NPC actions",
    })
    console.log("Generating messages for all NPCs")
    return generateMessagesForAllNPCs(args)
  })

  console.log("DONE WITH GEN")

  await step.run("generate-elder-council-tile-actions", async () => {
    await fbSet("rounds", args.currentRound.uid, {
      processingState: "Determining Elder Council actions",
    })
    await args.refresh()
    console.log("Generating elder council tile actions")
    return generateElderCouncilTileActions(args)
  })

  await step.run("determine-player-movement", async () => {
    await fbSet("rounds", args.currentRound.uid, {
      processingState: "Determining player and NPC movement",
    })
    await args.refresh()
    console.log("Determining player movement")
    return determinePlayerMovement(args)
  })

  await step.run("add-to-tile-history", async () => {
    await args.refresh()
    await fbSet("rounds", args.currentRound.uid, {
      processingState: "Determining results of tile actions",
    })
    console.log("Adding to tile history")
    return addToTileHistory(args)
  })

  await step.run("update-objectives", async () => {
    await args.refresh()
    console.log("Updating game tiles")
    return Promise.all([
      updateObjectives(args),
      updateGameTiles(args),
      spawnNpcs(args),
    ])
  })

  await args.refresh()

  console.log("Querying messages for this round")
  const messagesForThisRound = await queryDocs("messages", (ref) => {
    return ref.where("roundId", "==", args.currentRound.uid)
  })

  console.log("Setting processed at for messages")
  await Promise.all(
    messagesForThisRound.map((message) => {
      return fbSet("messages", message.uid, {
        processedAt: Timestamp.now(),
        processingStartedAt: Timestamp.now(),
        processingTriggeredAt: Timestamp.now(),
      })
    })
  )

  await fbSet("rounds", args.currentRound.uid, {
    processed: true,
  })

  await startNewRound(args)
}

export const processRound = createFunctionForCollection(
  "rounds",
  {
    concurrency: {
      key: "event.data.id",
      limit: 1,
    },
  },
  async (round, { step }) => {
    console.log("Processing round", round.uid)
    await runRoundProcessing(round.gameId, step)
  }
)
