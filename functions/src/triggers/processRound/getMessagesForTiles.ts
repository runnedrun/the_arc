import { groupBy } from "lodash-es"
import {
  CollectionReferenceWithTypedWhere,
  queryDocs,
  QueryWithTypedWhere,
} from "../../helpers/reader"
import { SKIP } from "@/data/readerFe"
import { Message } from "@/data/types/Message"

export const getMessagesForTiles = async ({
  roundId,
  gameId,
}: {
  roundId?: string
  gameId?: string
}) => {
  const tileMessagesForCurrentRound = await queryDocs("messages", (ref) => {
    let updatedRef = ref as QueryWithTypedWhere<Message>
    if (roundId) {
      updatedRef = updatedRef.where("roundId", "==", roundId)
    }
    if (gameId) {
      updatedRef = updatedRef.where("gameId", "==", gameId)
    }
    return updatedRef
      .where("archived", "==", false)
      .orderBy("createdAt", "desc")
      .orderBy("tileLocation")
      .limit(100)
  })

  const onlyTileMessages = tileMessagesForCurrentRound.filter(
    (m) => !!m.tileLocation
  )

  // Group messages by tile location
  return groupBy(onlyTileMessages, (m) => JSON.stringify(m.tileLocation))
}
