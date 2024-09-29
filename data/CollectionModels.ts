import { Game } from "./types/Game"
import { GameResult } from "./types/GameResult"
import { Message } from "./types/Message"
import { NPC } from "./types/NPC"
import { Player } from "./types/Player"
import { ProcessingJob } from "./types/ProcessJob"
import { Round } from "./types/Round"
import { User } from "./types/User"
import { ValleyTile } from "./types/ValleyTile"

export const CollectionNames: (keyof AllModels)[] = [
  "processingJob",
  "games",
  "players",
  "valleyTiles",
  "npcs",
  "gameResults",
  "rounds",
  "messages",
  "users",
] as const

export type AllModels = {
  processingJob: ProcessingJob
  games: Game
  players: Player
  valleyTiles: ValleyTile
  npcs: NPC
  gameResults: GameResult
  rounds: Round
  messages: Message
  users: User
}

export type CollectionModels = Omit<AllModels, "user">
