import { Model } from '../baseTypes/Model';

export type ElderCouncilProposal = Model<{
  gameId: string;
  round: number;
  playerId: string;
  content: string;
  status: 'PENDING' | 'ACCEPTED' | 'MODIFIED' | 'REJECTED';
  resolution?: string;
}>;