import { useState } from 'react';
import type { Trip, Participant } from '../types';
import './ParticipantManager.css';

interface ParticipantManagerProps {
  trip: Trip;
  onUpdateTrip: (trip: Trip) => void;
}

function ParticipantManager({ trip, onUpdateTrip }: ParticipantManagerProps) {
  const [newParticipantName, setNewParticipantName] = useState('');

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (newParticipantName.trim()) {
      const newParticipant: Participant = {
        id: Date.now().toString(),
        name: newParticipantName.trim(),
      };
      onUpdateTrip({
        ...trip,
        participants: [...trip.participants, newParticipant],
      });
      setNewParticipantName('');
    }
  };

  const handleRemoveParticipant = (participantId: string) => {
    const participant = trip.participants.find(p => p.id === participantId);
    const hasExpenses = trip.expenses.some(
      expense => expense.paidBy === participantId ||
      expense.shares.some(s => s.participantId === participantId && s.included)
    );

    if (hasExpenses) {
      alert(`Cannot remove ${participant?.name} because they are involved in expenses. Remove those expenses first.`);
      return;
    }

    if (confirm(`Are you sure you want to remove ${participant?.name}?`)) {
      onUpdateTrip({
        ...trip,
        participants: trip.participants.filter(p => p.id !== participantId),
      });
    }
  };

  return (
    <div className="participant-manager">
      <form onSubmit={handleAddParticipant} className="add-participant-form">
        <input
          type="text"
          value={newParticipantName}
          onChange={(e) => setNewParticipantName(e.target.value)}
          placeholder="Enter participant name"
          className="participant-input"
        />
        <button type="submit" className="btn btn-primary">
          Add Participant
        </button>
      </form>

      {trip.participants.length === 0 ? (
        <div className="empty-state">
          <p>No participants yet. Add people who are part of this trip.</p>
        </div>
      ) : (
        <div className="participant-list">
          {trip.participants.map((participant) => (
            <div key={participant.id} className="participant-item">
              <span className="participant-name">{participant.name}</span>
              <button
                className="btn-icon btn-remove"
                onClick={() => handleRemoveParticipant(participant.id)}
                title="Remove participant"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ParticipantManager;
