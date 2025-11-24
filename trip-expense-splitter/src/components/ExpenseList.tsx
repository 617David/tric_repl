import { useState } from 'react';
import type { Trip } from '../types';
import ExpenseForm from './ExpenseForm';
import './ExpenseList.css';

interface ExpenseListProps {
  trip: Trip;
  onUpdateTrip: (trip: Trip) => void;
}

function ExpenseList({ trip, onUpdateTrip }: ExpenseListProps) {
  const [showForm, setShowForm] = useState(false);

  const handleDeleteExpense = (expenseId: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      onUpdateTrip({
        ...trip,
        expenses: trip.expenses.filter(e => e.id !== expenseId),
      });
    }
  };

  const getParticipantName = (participantId: string) => {
    return trip.participants.find(p => p.id === participantId)?.name || 'Unknown';
  };

  if (trip.participants.length === 0) {
    return (
      <div className="empty-state">
        <p>Please add participants first before creating expenses.</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <div className="expense-list-header">
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Expense
        </button>
      </div>

      {showForm && (
        <ExpenseForm
          trip={trip}
          onUpdateTrip={onUpdateTrip}
          onClose={() => setShowForm(false)}
        />
      )}

      {trip.expenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses yet. Add your first expense to get started.</p>
        </div>
      ) : (
        <div className="expenses">
          {trip.expenses.map((expense) => {
            const includedCount = expense.shares.filter(s => s.included).length;
            return (
              <div key={expense.id} className="expense-item">
                <div className="expense-header">
                  <div className="expense-main">
                    <h4>{expense.description}</h4>
                    <p className="expense-meta">
                      Paid by {getParticipantName(expense.paidBy)} • {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="expense-amount">
                    <span className="amount">€{expense.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="expense-details">
                  <span className="distribution-info">
                    Split {expense.distributionMethod === 'equal' ? 'equally' :
                          expense.distributionMethod === 'custom_amount' ? 'by custom amounts' :
                          'by percentages'} among {includedCount} {includedCount === 1 ? 'person' : 'people'}
                  </span>
                  <button
                    className="btn-icon btn-delete-expense"
                    onClick={() => handleDeleteExpense(expense.id)}
                    title="Delete expense"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
