import { openDB, type IDBPDatabase } from 'idb';
import type { GymSession, SyncQueue } from '@/types/gym';

const DB_NAME = 'gym-checkins';
const DB_VERSION = 1;

interface GymCheckInsDB {
  sessions: {
    key: string;
    value: GymSession;
    indexes: { 'by-date': string };
  };
  syncQueue: {
    key: string;
    value: SyncQueue;
  };
}

let dbPromise: Promise<IDBPDatabase<GymCheckInsDB>> | null = null;

export const initDB = async () => {
  // Only initialize IndexedDB on the client side
  if (typeof window === 'undefined') {
    throw new Error('Cannot initialize IndexedDB on server side');
  }

  return openDB<GymCheckInsDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Sessions store
      const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
      sessionStore.createIndex('by-date', 'checkInTime');

      // Sync queue store
      db.createObjectStore('syncQueue', { keyPath: 'id' });
    },
  });
};

// Lazy initialization of the database
export const db = typeof window === 'undefined' 
  ? Promise.reject(new Error('Cannot access IndexedDB on server side'))
  : (dbPromise || (dbPromise = initDB()));

// Helper function to ensure we're on client side before accessing DB
export const getDB = async () => {
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB is not available during server-side rendering');
  }
  return db;
} 