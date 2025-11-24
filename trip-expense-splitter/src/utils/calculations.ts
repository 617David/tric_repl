import type { Expense, Settlement } from '../types';
import { DistributionMethod } from '../types';

export function calculateExpenseShares(expense: Expense): Map<string, number> {
  const shares = new Map<string, number>();

  switch (expense.distributionMethod) {
    case DistributionMethod.EQUAL: {
      const includedParticipants = expense.shares.filter(s => s.included);
      const shareAmount = expense.totalAmount / includedParticipants.length;
      includedParticipants.forEach(share => {
        shares.set(share.participantId, shareAmount);
      });
      break;
    }

    case DistributionMethod.CUSTOM_AMOUNT: {
      expense.shares.forEach(share => {
        if (share.included && share.value !== undefined) {
          shares.set(share.participantId, share.value);
        }
      });
      break;
    }

    case DistributionMethod.PERCENTAGE: {
      expense.shares.forEach(share => {
        if (share.included && share.value !== undefined) {
          const amount = (expense.totalAmount * share.value) / 100;
          shares.set(share.participantId, amount);
        }
      });
      break;
    }
  }

  return shares;
}

export function calculateBalances(expenses: Expense[]): Map<string, number> {
  const balances = new Map<string, number>();

  expenses.forEach(expense => {
    // Person who paid gets credited
    const currentBalance = balances.get(expense.paidBy) || 0;
    balances.set(expense.paidBy, currentBalance + expense.totalAmount);

    // Calculate what each person owes
    const shares = calculateExpenseShares(expense);
    shares.forEach((amount, participantId) => {
      const current = balances.get(participantId) || 0;
      balances.set(participantId, current - amount);
    });
  });

  return balances;
}

export function calculateSettlements(expenses: Expense[]): Settlement[] {
  const balances = calculateBalances(expenses);

  // Separate creditors and debtors
  const creditors: Array<{ id: string; amount: number }> = [];
  const debtors: Array<{ id: string; amount: number }> = [];

  balances.forEach((balance, participantId) => {
    if (balance > 0.01) {
      creditors.push({ id: participantId, amount: balance });
    } else if (balance < -0.01) {
      debtors.push({ id: participantId, amount: -balance });
    }
  });

  // Sort by amount (largest first) for better optimization
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];
  let i = 0;
  let j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const settleAmount = Math.min(creditor.amount, debtor.amount);

    settlements.push({
      from: debtor.id,
      to: creditor.id,
      amount: Math.round(settleAmount * 100) / 100, // Round to 2 decimals
    });

    creditor.amount -= settleAmount;
    debtor.amount -= settleAmount;

    if (creditor.amount < 0.01) i++;
    if (debtor.amount < 0.01) j++;
  }

  return settlements;
}

export function validatePercentages(shares: Array<{ included: boolean; value?: number }>): boolean {
  const includedShares = shares.filter(s => s.included);
  const total = includedShares.reduce((sum, s) => sum + (s.value || 0), 0);
  return Math.abs(total - 100) < 0.01;
}

export function validateCustomAmounts(shares: Array<{ included: boolean; value?: number }>, totalAmount: number): boolean {
  const includedShares = shares.filter(s => s.included);
  const total = includedShares.reduce((sum, s) => sum + (s.value || 0), 0);
  return Math.abs(total - totalAmount) < 0.01;
}
