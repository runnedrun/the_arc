import { Model } from '../baseTypes/Model';

export type ValleyTile = Model<{
  gameId: string;
  x: number;
  y: number;
  history: string[];
}>;