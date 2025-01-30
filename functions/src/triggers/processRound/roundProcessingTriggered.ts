import { safeSetTestMode } from "@/helpers/getUuid"
import { Timestamp } from "firebase-admin/firestore"
import { queryDocs, readDoc } from "../../helpers/reader"
import { fbSet } from "../../helpers/writer"
import { createObjectives } from "../processGame/createObjectives"
import { GameProcessingArgs, getGameData } from "../processGame/getGameData"
import { startNewRound } from "../processGame/startNewRound"
import { updateGameTiles } from "../processGame/updateGameTiles"
import { ProcessJobFn } from "../triggerProcessJob"
import { addToTileHistory } from "./addToTileHistory"
import { determinePlayerMovement } from "./determinePlayerMovement"
import { generateElderCouncilMessages } from "./generateElderCouncilMessages"
import { generateElderCouncilTileActions } from "./generateElderCouncilTileActions"
import { generateMessagesForAllNPCs } from "./generateMessagesForAllNPCs"
import { scoreCurrentObjectives } from "./scoreCurrentObjectives"
import { spawnNewNpc } from "./spawnNewNpc"
import { objectiveScoringFrequency } from "./objectiveScoringFrequency"

const updateObjectives = async (args: GameProcessingArgs) => {
  if (
    args.currentRound.index &&
    args.currentRound.index % objectiveScoringFrequency === 0
  ) {
    console.log("Scoring current objectives")
    await scoreCurrentObjectives(args)
    console.log("Creating new objectives")
    await createObjectives(args)
  }
}

const spawnNpcs = async (args: GameProcessingArgs) => {
  if (args.currentRound.index % 2 === 1) {
    console.log("Spawning new NPC")
    await spawnNewNpc(args)
  }
}

const runRoundProcessing = async (args: GameProcessingArgs) => {
  const allPlayersHaveCompletedTheRound = args.players.every(
    (player) => !!args.currentRound.playersCompletedAt?.[player.uid]
  )

  console.log(
    "allPlayersHaveCompletedTheRound",
    allPlayersHaveCompletedTheRound
  )

  if (!allPlayersHaveCompletedTheRound) {
    return false
  }

  await fbSet("rounds", args.currentRound.uid, {
    processingStartedAt: Timestamp.now(),
  })
  console.log("Generating messages for all NPCs")
  await generateMessagesForAllNPCs(args)
  await args.refresh()
  console.log("Generating elder council tile actions")
  await generateElderCouncilTileActions(args)
  await args.refresh()
  console.log("Determining player movement")
  await determinePlayerMovement(args)
  await args.refresh()
  console.log("Adding to tile history")
  await addToTileHistory(args)
  await args.refresh()
  console.log("Generating elder council messages")
  await generateElderCouncilMessages(args)
  await args.refresh()
  console.log("Updating game tiles")
  await Promise.all([
    updateObjectives(args),
    updateGameTiles(args),
    spawnNpcs(args),
  ])
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

  return false
}

export const roundProcessingTriggered: ProcessJobFn = async ({ docId }) => {
  const round = await readDoc("rounds", docId)
  const gameId = round.gameId
  const args = await getGameData(gameId)
  await safeSetTestMode(args.game.isTestGame, async () => {
    await runRoundProcessing(args)
  })
  return false
}
