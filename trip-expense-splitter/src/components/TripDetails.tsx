import { useState } from 'react';
import type { Trip } from '../types';
import ParticipantManager from './ParticipantManager';
import ExpenseList from './ExpenseList';
import SettlementView from './SettlementView';
import './TripDetails.css';

interface TripDetailsProps {
  trip: Trip;
  onUpdateTrip: (trip: Trip) => void;
  onBack: () => void;
}

type TabType = 'participants' | 'expenses' | 'settlements';

function TripDetails({ trip, onUpdateTrip, onBack }: TripDetailsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('participants');

  return (
    <div className="trip-details">
      <div className="trip-details-header">
        <button className="btn-back" onClick={onBack}>
          ← Back to Trips
        </button>
        <div>
          <h2>{trip.name}</h2>
          {trip.description && <p className="trip-description">{trip.description}</p>}
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'participants' ? 'active' : ''}`}
          onClick={() => setActiveTab('participants')}
        >
          Participants ({trip.participants.length})
        </button>
        <button
          className={`tab ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          Expenses ({trip.expenses.length})
        </button>
        <button
          className={`tab ${activeTab === 'settlements' ? 'active' : ''}`}
          onClick={() => setActiveTab('settlements')}
        >
          Settlements
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'participants' && (
          <ParticipantManager trip={trip} onUpdateTrip={onUpdateTrip} />
        )}
        {activeTab === 'expenses' && (
          <ExpenseList trip={trip} onUpdateTrip={onUpdateTrip} />
        )}
        {activeTab === 'settlements' && (
          <SettlementView trip={trip} />
        )}
      </div>
    </div>
  );
}

export default TripDetails;
