export interface Participant {
  id: string;
  name: string;
}

export type DistributionMethod = 'equal' | 'custom_amount' | 'percentage';

export const DistributionMethod = {
  EQUAL: 'equal' as const,
  CUSTOM_AMOUNT: 'custom_amount' as const,
  PERCENTAGE: 'percentage' as const,
};

export interface ParticipantShare {
  participantId: string;
  included: boolean;
  value?: number; // Amount in € or percentage
}

export interface Expense {
  id: string;
  description: string;
  totalAmount: number;
  paidBy: string; // participant id
  date: string;
  distributionMethod: DistributionMethod;
  shares: ParticipantShare[];
}

export interface Trip {
  id: string;
  name: string;
  description?: string;
  participants: Participant[];
  expenses: Expense[];
  createdAt: string;
}

export interface Settlement {
  from: string; // participant id
  to: string; // participant id
  amount: number;
}
