import { useState } from 'react';
import type { Trip } from '../types';
import './TripList.css';

interface TripListProps {
  trips: Trip[];
  onCreateTrip: (name: string, description: string) => void;
  onSelectTrip: (tripId: string) => void;
  onDeleteTrip: (tripId: string) => void;
}

function TripList({ trips, onCreateTrip, onSelectTrip, onDeleteTrip }: TripListProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateTrip(name.trim(), description.trim());
      setName('');
      setDescription('');
      setShowForm(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, tripId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this trip?')) {
      onDeleteTrip(tripId);
    }
  };

  return (
    <div className="trip-list">
      <div className="trip-list-header">
        <h2>Your Trips</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + New Trip
        </button>
      </div>

      {showForm && (
        <div className="trip-form-modal">
          <div className="trip-form-content">
            <h3>Create New Trip</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="trip-name">Trip Name *</label>
                <input
                  id="trip-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Weekend in Paris"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="trip-description">Description</label>
                <input
                  id="trip-description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {trips.length === 0 ? (
        <div className="empty-state">
          <p>No trips yet. Create your first trip to get started!</p>
        </div>
      ) : (
        <div className="trip-grid">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="trip-card"
              onClick={() => onSelectTrip(trip.id)}
            >
              <div className="trip-card-header">
                <h3>{trip.name}</h3>
                <button
                  className="btn-icon btn-delete"
                  onClick={(e) => handleDelete(e, trip.id)}
                  title="Delete trip"
                >
                  ×
                </button>
              </div>
              {trip.description && <p className="trip-description">{trip.description}</p>}
              <div className="trip-stats">
                <span>{trip.participants.length} participants</span>
                <span>{trip.expenses.length} expenses</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TripList;
