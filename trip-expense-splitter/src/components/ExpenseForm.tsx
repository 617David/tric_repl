import { useState, useEffect } from 'react';
import type { Trip, Expense, ParticipantShare } from '../types';
import { DistributionMethod } from '../types';
import { validatePercentages, validateCustomAmounts } from '../utils/calculations';
import './ExpenseForm.css';

interface ExpenseFormProps {
  trip: Trip;
  onUpdateTrip: (trip: Trip) => void;
  onClose: () => void;
}

function ExpenseForm({ trip, onUpdateTrip, onClose }: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidBy, setPaidBy] = useState(trip.participants[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [distributionMethod, setDistributionMethod] = useState<DistributionMethod>(DistributionMethod.EQUAL);
  const [shares, setShares] = useState<ParticipantShare[]>(
    trip.participants.map(p => ({
      participantId: p.id,
      included: true,
      value: distributionMethod === DistributionMethod.PERCENTAGE ? 0 : undefined,
    }))
  );

  useEffect(() => {
    setShares(trip.participants.map(p => {
      const existingShare = shares.find(s => s.participantId === p.id);
      return existingShare || {
        participantId: p.id,
        included: true,
        value: distributionMethod === DistributionMethod.PERCENTAGE ? 0 : undefined,
      };
    }));
  }, [trip.participants]);

  useEffect(() => {
    setShares(shares.map(share => ({
      ...share,
      value: distributionMethod === DistributionMethod.EQUAL ? undefined :
             distributionMethod === DistributionMethod.PERCENTAGE ? (share.value || 0) :
             share.value,
    })));
  }, [distributionMethod]);

  const handleToggleParticipant = (participantId: string) => {
    setShares(shares.map(share =>
      share.participantId === participantId
        ? { ...share, included: !share.included }
        : share
    ));
  };

  const handleShareValueChange = (participantId: string, value: number) => {
    setShares(shares.map(share =>
      share.participantId === participantId
        ? { ...share, value }
        : share
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(totalAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const includedShares = shares.filter(s => s.included);
    if (includedShares.length === 0) {
      alert('Please select at least one participant');
      return;
    }

    if (distributionMethod === DistributionMethod.PERCENTAGE) {
      if (!validatePercentages(shares)) {
        alert('Percentages must add up to 100%');
        return;
      }
    }

    if (distributionMethod === DistributionMethod.CUSTOM_AMOUNT) {
      if (!validateCustomAmounts(shares, amount)) {
        alert(`Custom amounts must add up to €${amount.toFixed(2)}`);
        return;
      }
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      description: description.trim(),
      totalAmount: amount,
      paidBy,
      date,
      distributionMethod,
      shares: shares.map(s => ({
        ...s,
        value: s.included ? s.value : undefined,
      })),
    };

    onUpdateTrip({
      ...trip,
      expenses: [...trip.expenses, newExpense],
    });

    onClose();
  };

  const calculateRemainingAmount = () => {
    if (distributionMethod === DistributionMethod.CUSTOM_AMOUNT) {
      const total = parseFloat(totalAmount) || 0;
      const used = shares.filter(s => s.included).reduce((sum, s) => sum + (s.value || 0), 0);
      return total - used;
    }
    return 0;
  };

  const calculateRemainingPercentage = () => {
    if (distributionMethod === DistributionMethod.PERCENTAGE) {
      const used = shares.filter(s => s.included).reduce((sum, s) => sum + (s.value || 0), 0);
      return 100 - used;
    }
    return 0;
  };

  return (
    <div className="expense-form-modal">
      <div className="expense-form-content">
        <div className="expense-form-header">
          <h3>Add New Expense</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Restaurant dinner"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Total Amount (€) *</label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="paidBy">Paid by *</label>
            <select
              id="paidBy"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              required
            >
              {trip.participants.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Distribution Method *</label>
            <div className="distribution-method-selector">
              <button
                type="button"
                className={`method-btn ${distributionMethod === DistributionMethod.EQUAL ? 'active' : ''}`}
                onClick={() => setDistributionMethod(DistributionMethod.EQUAL)}
              >
                Equal Split
              </button>
              <button
                type="button"
                className={`method-btn ${distributionMethod === DistributionMethod.CUSTOM_AMOUNT ? 'active' : ''}`}
                onClick={() => setDistributionMethod(DistributionMethod.CUSTOM_AMOUNT)}
              >
                Custom Amount (€)
              </button>
              <button
                type="button"
                className={`method-btn ${distributionMethod === DistributionMethod.PERCENTAGE ? 'active' : ''}`}
                onClick={() => setDistributionMethod(DistributionMethod.PERCENTAGE)}
              >
                Percentage (%)
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Participants *</label>
            <div className="participants-shares">
              {trip.participants.map(participant => {
                const share = shares.find(s => s.participantId === participant.id);
                if (!share) return null;

                return (
                  <div key={participant.id} className="participant-share-row">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={share.included}
                        onChange={() => handleToggleParticipant(participant.id)}
                      />
                      <span>{participant.name}</span>
                    </label>

                    {share.included && distributionMethod !== DistributionMethod.EQUAL && (
                      <input
                        type="number"
                        step={distributionMethod === DistributionMethod.PERCENTAGE ? '0.01' : '0.01'}
                        min="0"
                        max={distributionMethod === DistributionMethod.PERCENTAGE ? '100' : undefined}
                        value={share.value || 0}
                        onChange={(e) => handleShareValueChange(participant.id, parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="share-input"
                      />
                    )}

                    {share.included && distributionMethod === DistributionMethod.EQUAL && (
                      <span className="share-auto">
                        Auto
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {distributionMethod === DistributionMethod.CUSTOM_AMOUNT && totalAmount && (
              <div className={`validation-info ${Math.abs(calculateRemainingAmount()) < 0.01 ? 'valid' : 'invalid'}`}>
                Remaining: €{calculateRemainingAmount().toFixed(2)}
              </div>
            )}

            {distributionMethod === DistributionMethod.PERCENTAGE && (
              <div className={`validation-info ${Math.abs(calculateRemainingPercentage()) < 0.01 ? 'valid' : 'invalid'}`}>
                Remaining: {calculateRemainingPercentage().toFixed(2)}%
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpenseForm;
