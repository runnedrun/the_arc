import { getOpenAIClient } from "../../helpers/getOpenAIClient"
import { GameProcessingArgs } from "../processGame/getGameData"
import { getMessagesForTiles } from "./getMessagesForTiles"

const openAi = getOpenAIClient()

export const addToTileHistory = async ({
  currentRound,
}: GameProcessingArgs) => {
  const messagesGroupedByTile = await getMessagesForTiles(currentRound.uid)
  Object.entries(messagesGroupedByTile).map(([tileCoordsStr, messages]) => {
    const tileCords = JSON.parse(tileCoordsStr)
    messages
  })
}
