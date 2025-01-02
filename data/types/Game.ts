import { Timestamp } from "firebase/firestore"
import { Model } from "../baseTypes/Model"

export const getDefaultGameData = () => {
  return {
    environmentDescription: null,
    environmentName: null,
    defaultEnvironmentId: null,
    currentRoundNumber: null,
    currentRoundId: null,
    startTime: null,
    endTime: null,
    elderCouncilLetters: null,
    createdBy: null,
    mapSize: null,
    name: "New Game",
  } as Game
}

export type Game = Model<{
  environmentDescription?: string
  environmentName?: string
  defaultEnvironmentId?: string
  currentRoundNumber: number
  currentRoundId: string
  startTime: Timestamp
  gameSetupCompletedAt?: Timestamp
  endTime: Timestamp | null
  elderCouncilLetters: number
  createdBy: string // player id
  mapSize: number
  name: string
}>
