import type { Trip } from '../types';
import { calculateSettlements, calculateBalances } from '../utils/calculations';
import './SettlementView.css';

interface SettlementViewProps {
  trip: Trip;
}

function SettlementView({ trip }: SettlementViewProps) {
  const settlements = calculateSettlements(trip.expenses);
  const balances = calculateBalances(trip.expenses);

  const getParticipantName = (participantId: string) => {
    return trip.participants.find(p => p.id === participantId)?.name || 'Unknown';
  };

  if (trip.expenses.length === 0) {
    return (
      <div className="empty-state">
        <p>No expenses yet. Add expenses to see settlements.</p>
      </div>
    );
  }

  return (
    <div className="settlement-view">
      <div className="settlements-section">
        <h3>Suggested Reimbursements</h3>
        {settlements.length === 0 ? (
          <div className="all-settled">
            <p>✓ All settled! Everyone has paid their fair share.</p>
          </div>
        ) : (
          <div className="settlement-list">
            {settlements.map((settlement, index) => (
              <div key={index} className="settlement-item">
                <div className="settlement-info">
                  <span className="settlement-from">{getParticipantName(settlement.from)}</span>
                  <span className="settlement-arrow">→</span>
                  <span className="settlement-to">{getParticipantName(settlement.to)}</span>
                </div>
                <div className="settlement-amount">
                  €{settlement.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="balances-section">
        <h3>Individual Balances</h3>
        <div className="balance-list">
          {trip.participants.map(participant => {
            const balance = balances.get(participant.id) || 0;
            return (
              <div key={participant.id} className="balance-item">
                <span className="balance-name">{participant.name}</span>
                <span className={`balance-amount ${balance > 0 ? 'positive' : balance < 0 ? 'negative' : 'neutral'}`}>
                  {balance > 0 ? '+' : ''}€{balance.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="balance-legend">
          <p><span className="positive-indicator">Positive</span> = gets money back</p>
          <p><span className="negative-indicator">Negative</span> = owes money</p>
        </div>
      </div>
    </div>
  );
}

export default SettlementView;
