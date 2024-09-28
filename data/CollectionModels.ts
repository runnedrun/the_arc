import { ProcessingJob } from "./types/ProcessJob"
import { Game } from './types/Game';
import { Player } from './types/Player';
import { ValleyTile } from './types/ValleyTile';
import { NPC } from './types/NPC';
import { Action } from './types/Action';
import { ElderCouncilProposal } from './types/ElderCouncilProposal';
import { GameResult } from './types/GameResult';

export const CollectionNames: (keyof AllModels)[] = [
  "processingJob",
  "games",
  "players",
  "valleyTiles",
  "npcs",
  "actions",
  "elderCouncilProposals",
  "gameResults",
] as const;

export type AllModels = { 
  processingJob: ProcessingJob,
  games: Game;
  players: Player;
  valleyTiles: ValleyTile;
  npcs: NPC;
  actions: Action;
  elderCouncilProposals: ElderCouncilProposal;
  gameResults: GameResult;
}

export type CollectionModels = Omit<AllModels, "user">
