import type { Trip } from './types';

const STORAGE_KEY = 'trip-expense-splitter-data';

export const storage = {
  getTrips(): Trip[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveTrips(trips: Trip[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  },

  addTrip(trip: Trip): void {
    const trips = this.getTrips();
    trips.push(trip);
    this.saveTrips(trips);
  },

  updateTrip(updatedTrip: Trip): void {
    const trips = this.getTrips();
    const index = trips.findIndex(t => t.id === updatedTrip.id);
    if (index !== -1) {
      trips[index] = updatedTrip;
      this.saveTrips(trips);
    }
  },

  deleteTrip(tripId: string): void {
    const trips = this.getTrips();
    const filtered = trips.filter(t => t.id !== tripId);
    this.saveTrips(filtered);
  },

  getTrip(tripId: string): Trip | undefined {
    const trips = this.getTrips();
    return trips.find(t => t.id === tripId);
  }
};
