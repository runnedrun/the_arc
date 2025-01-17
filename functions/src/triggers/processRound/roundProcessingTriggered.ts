import { GameProcessingArgs, getGameData } from "../processGame/getGameData"
import { ProcessJobFn } from "../triggerProcessJob"
import { generateMessagesForAllNPCs } from "./generateMessagesForAllNPCs"
import { generateElderCouncilTileActions } from "./generateElderCouncilTileActions"
import { addToTileHistory } from "./addToTileHistory"
import { generateElderCouncilMessages } from "./generateElderCouncilMessages"
import { queryDocs, readDoc } from "../../helpers/reader"
import { startNewRound } from "../processGame/startNewRound"
import { fbSet } from "../../helpers/writer"
import { Timestamp } from "firebase-admin/firestore"
import { safeSetTestMode } from "@/helpers/getUuid"
import { updateGameTiles } from "../processGame/updateGameTiles"
import { spawnNewNpc } from "./spawnNewNpc"

const runRoundProcessing = async (args: GameProcessingArgs) => {
  const allPlayersHaveCompletedTheRound = args.players.every(
    (player) => !!args.currentRound.playersCompletedAt?.[player.uid]
  )

  console.log(
    "charactersUsedThisRound",
    args.currentRound.playersCompletedAt,
    args.currentRound
  )

  console.log(
    "allPlayersHaveCompletedTheRound",
    allPlayersHaveCompletedTheRound,
    args.players,
    args.currentRound
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
  console.log("Adding to tile history")
  await addToTileHistory(args)
  await args.refresh()
  console.log("Generating elder council messages")
  await generateElderCouncilMessages(args)
  await args.refresh()
  console.log("Updating game tiles")
  await updateGameTiles(args)
  await args.refresh()

  if (args.currentRound.index % 2 === 0) {
    await spawnNewNpc(args)
  }

  console.log("Querying messages for this round")
  const messagesForThisRound = await queryDocs("messages", (ref) => {
    return ref
      .where("archived", "==", false)
      .where("roundId", "==", args.currentRound.uid)
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
