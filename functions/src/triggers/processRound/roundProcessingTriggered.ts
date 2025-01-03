import { readDoc } from "@/data/readerFe"
import { getGameData } from "../processGame/getGameData"
import { ProcessJobFn } from "../triggerProcessJob"
import { generateMessagesForAllNPCs } from "./generateMessagesForAllNPCs"
import { generateElderCouncilTileActions } from "./generateElderCouncilTileActions"
import { addToTileHistory } from "./addToTileHistory"
import { generateElderCouncilMessages } from "./generateElderCouncilMessages"
import { fbSet } from "@/data/writerFe"
import { Timestamp } from "firebase/firestore"
import { queryDocs } from "../../helpers/reader"
import { startNewRound } from "../processGame/startNewRound"

export const roundProcessingTriggered: ProcessJobFn = async ({ docId }) => {
  const round = await readDoc("rounds", docId)
  const gameId = round.gameId
  const args = await getGameData(gameId)

  const allPlayersHaveCompletedTheRound = args.players.every(
    (player) => !!args.currentRound.playersCompletedAt?.[player.uid]
  )

  if (!allPlayersHaveCompletedTheRound) {
    return false
  }

  await fbSet("rounds", args.currentRound.uid, {
    processingStartedAt: Timestamp.now(),
  })
  await generateMessagesForAllNPCs(args)
  await args.refresh()
  await generateElderCouncilTileActions(args)
  await args.refresh()
  await addToTileHistory(args)
  await args.refresh()
  await generateElderCouncilMessages(args)

  const messagesForThisRound = await queryDocs("messages", (ref) => {
    return ref
      .where("archived", "==", false)
      .where("roundId", "==", args.currentRound.uid)
  })

  await Promise.all(
    messagesForThisRound.map((message) => {
      return fbSet("messages", message.uid, {
        processedAt: Timestamp.now(),
      })
    })
  )

  await fbSet("rounds", args.currentRound.uid, {
    processed: true,
  })

  await startNewRound(args)

  return false
}
