import { useState, useEffect } from 'react';
import type { Trip } from './types';
import { storage } from './storage';
import TripList from './components/TripList';
import TripDetails from './components/TripDetails';
import './App.css';

function App() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  useEffect(() => {
    setTrips(storage.getTrips());
  }, []);

  const handleCreateTrip = (name: string, description: string) => {
    const newTrip: Trip = {
      id: Date.now().toString(),
      name,
      description,
      participants: [],
      expenses: [],
      createdAt: new Date().toISOString(),
    };
    storage.addTrip(newTrip);
    setTrips(storage.getTrips());
    setSelectedTripId(newTrip.id);
  };

  const handleSelectTrip = (tripId: string) => {
    setSelectedTripId(tripId);
  };

  const handleUpdateTrip = (updatedTrip: Trip) => {
    storage.updateTrip(updatedTrip);
    setTrips(storage.getTrips());
  };

  const handleDeleteTrip = (tripId: string) => {
    storage.deleteTrip(tripId);
    setTrips(storage.getTrips());
    if (selectedTripId === tripId) {
      setSelectedTripId(null);
    }
  };

  const handleBackToList = () => {
    setSelectedTripId(null);
  };

  const selectedTrip = trips.find(t => t.id === selectedTripId);

  return (
    <div className="app">
      <header className="app-header">
        <h1>💶 Trip Expense Splitter</h1>
        <p>Split costs fairly after your trips</p>
      </header>

      <main className="app-main">
        {!selectedTrip ? (
          <TripList
            trips={trips}
            onCreateTrip={handleCreateTrip}
            onSelectTrip={handleSelectTrip}
            onDeleteTrip={handleDeleteTrip}
          />
        ) : (
          <TripDetails
            trip={selectedTrip}
            onUpdateTrip={handleUpdateTrip}
            onBack={handleBackToList}
          />
        )}
      </main>
    </div>
  );
}

export default App;
