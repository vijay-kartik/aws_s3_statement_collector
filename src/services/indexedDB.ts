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

// Helper constant to determine if we're on client side
const isClient = typeof window !== 'undefined';

let dbPromise: Promise<IDBPDatabase<GymCheckInsDB>> | null = null;

export const initDB = async () => {
  // Only initialize IndexedDB on the client side
  if (!isClient) {
    return Promise.reject(new Error('Cannot initialize IndexedDB on server side'));
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

// Create a function to safely get dbPromise
const getDBPromise = () => {
  if (!isClient) {
    return Promise.reject(new Error('Cannot access IndexedDB on server side'));
  }
  
  if (!dbPromise) {
    dbPromise = initDB();
  }
  
  return dbPromise;
};

// Helper function to ensure we're on client side before accessing DB
export const getDB = async () => {
  if (!isClient) {
    // Return null in server environment without throwing an error
    console.warn('IndexedDB access attempted during server-side rendering');
    return null;
  }
  
  try {
    return await getDBPromise();
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
    return null;
  }
} 