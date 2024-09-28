import { Model } from '../baseTypes/Model';


export type GameResult = Model<{
  gameId: string;
  winnerId: string;
  judgeReasoning: string;
  finalValleyState: string;
}>;