import { groupBy } from "lodash-es"
import { queryDocs } from "../../helpers/reader"

export const getMessagesForTiles = async (roundId: string) => {
  const messagesForCurrentRound = await queryDocs("messages", (ref) =>
    ref.where("roundId", "==", roundId)
  )

  // Group messages by tile location
  return groupBy(messagesForCurrentRound, (m) => JSON.stringify(m.tileLocation))
}
