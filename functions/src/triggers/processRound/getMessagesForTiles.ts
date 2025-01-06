import { groupBy } from "lodash-es"
import { queryDocs } from "../../helpers/reader"

export const getMessagesForTiles = async (roundId: string) => {
  const tileMessagesForCurrentRound = await queryDocs("messages", (ref) =>
    ref
      .where("roundId", "==", roundId)
      .where("archived", "==", false)
      .orderBy("tileLocation")
      .orderBy("createdAt", "desc")
      .limit(100)
  )

  // Group messages by tile location
  return groupBy(tileMessagesForCurrentRound, (m) =>
    JSON.stringify(m.tileLocation)
  )
}
