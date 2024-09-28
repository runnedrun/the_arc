import { Model } from '../baseTypes/Model';

export type Player = Model<{
  gameId: string;
  name: string;
  secretVision: string;
  letters: number;
  position: { x: number; y: number };
  age: number;
  letterSpendingCap: number;
}>;