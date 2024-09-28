import { Model } from '../baseTypes/Model';

export type NPC = Model<{
  gameId: string;
  name: string;
  position: { x: number; y: number };
  letters: number;
  personality: string;
  createdRound: number;
}>;