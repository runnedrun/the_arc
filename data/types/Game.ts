import { Timestamp } from "firebase/firestore"
import { ValleyTile } from "./ValleyTile"
import { Model } from "../baseTypes/Model"

export type Game = Model<{
  currentRound: number
  startTime: Timestamp
  endTime: Timestamp | null
  valleyGrid: string[] // valley tile ids
  elderCouncilLetters: number
  createdBy: string // player id
  name: string
}>
