import { Model } from '../baseTypes/Model';

export type Action = Model<{
  gameId: string;
  round: number;
  playerId: string;
  type: 'MOVE' | 'MESSAGE_HISTORIAN' | 'INTERACT_NPC' | 'INFLUENCE_COUNCIL';
  content: string;
  targetId?: string; // For NPC interactions or specific tile messages
  lettersSpent: number;
}>;