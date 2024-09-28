import { Timestamp } from "firebase/firestore"
import { ValleyTile } from "./ValleyTile"
import { Model } from "../baseTypes/Model"

export type Game = Model<{
  players: string[] // Array of player UIDs
  currentRound: number
  startTime: Timestamp
  endTime: Timestamp | null
  valleyGrid: string[][] // valley tile ids
  elderCouncilLetters: number
  name: string
}>
