import { getDB } from './indexedDB';
import { dynamoService } from './dynamoDB';
import { GymSession, SyncOperation, SyncQueue } from '@/types/gym';

export const syncService = {
  async addToSyncQueue(operation: SyncOperation, session: GymSession) {
    const dbInstance = await getDB();
    if (!dbInstance) return;

    const syncItem: SyncQueue = {
      id: `${operation}_${session.id}_${Date.now()}`,
      operation,
      data: session,
      timestamp: new Date().toISOString()
    };

    await dbInstance.add('syncQueue', syncItem);
  },

  async processSyncQueue() {
    const dbInstance = await getDB();
    if (!dbInstance) return;
    
    try {
      // Get all items from sync queue first
      const queue = await dbInstance.getAll('syncQueue');
      
      // Process each item sequentially
      for (const item of queue) {
        try {
          // Only sync completed sessions to DynamoDB
          if (item.data.status === 'completed') {
            // First, try to sync with DynamoDB
            switch (item.operation) {
              case 'create':
              case 'update':
                await dynamoService.createSession(item.data);
                break;
              case 'delete':
                await dynamoService.deleteSession(item.data);
                break;
            }
          }

          // Update IndexedDB regardless of session status
          await new Promise((resolve, reject) => {
            const tx = dbInstance.transaction(['syncQueue', 'sessions'], 'readwrite');
            
            tx.oncomplete = () => resolve(undefined);
            tx.onerror = () => reject(tx.error);
            
            const sessionStore = tx.objectStore('sessions');
            if (item.operation === 'delete') {
              // For delete operations, remove the session from IndexedDB
              sessionStore.delete(item.data.id);
            } else {
              // For create/update operations, update the session
              sessionStore.put({
                ...item.data,
                syncStatus: item.data.status === 'completed' ? 'synced' : 'pending',
                lastSynced: item.data.status === 'completed' ? new Date().toISOString() : undefined
              });
            }
            
            // Remove the item from sync queue
            const syncStore = tx.objectStore('syncQueue');
            syncStore.delete(item.id);
          });
        } catch (error) {
          console.error('Sync failed for item:', item, error);
          
          if (item.operation !== 'delete') {
            // Handle error by marking the session as failed
            await new Promise((resolve, reject) => {
              const tx = dbInstance.transaction('sessions', 'readwrite');
              
              tx.oncomplete = () => resolve(undefined);
              tx.onerror = () => reject(tx.error);
              
              tx.objectStore('sessions').put({
                ...item.data,
                syncStatus: 'failed'
              });
            });
          }
        }
      }
    } catch (error) {
      console.error('Error processing sync queue:', error);
      throw error;
    }
  },

  async fullSync() {
    const dbInstance = await getDB();
    if (!dbInstance) return;

    try {
      // Process any pending changes first to ensure they're synced to DynamoDB
      await this.processSyncQueue();

      // Get all months in the last year
      const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return `${date.getFullYear()}_${String(date.getMonth() + 1).padStart(2, '0')}`;
      });

      // Get current active session from localStorage if exists
      const currentSession = JSON.parse(localStorage.getItem('currentGymSession') || 'null');

      // Track all fetched sessions from DynamoDB (source of truth)
      const allFetchedSessions: GymSession[] = [];

      // Fetch all sessions from DynamoDB
      for (const month of months) {
        try {
          const sessions = await dynamoService.getSessionsForMonth(month);
          if (sessions.length > 0) {
            allFetchedSessions.push(...sessions);
          }
        } catch (error) {
          console.error(`Error syncing month ${month}:`, error);
        }
      }

      // Replace all completed sessions in IndexedDB with DynamoDB data
      await new Promise((resolve, reject) => {
        const tx = dbInstance.transaction('sessions', 'readwrite');
        tx.oncomplete = () => resolve(undefined);
        tx.onerror = () => reject(tx.error);
        
        const store = tx.objectStore('sessions');

        // First, clear all completed sessions
        store.openCursor().then(function deleteCursor(cursor): Promise<void> | void {
          if (!cursor) return;
          
          const session = cursor.value;
          // Only delete completed sessions, preserve active ones
          if (session.status === 'completed') {
            cursor.delete();
          }
          return cursor.continue().then(deleteCursor);
        }).then(() => {
          // Then, add all sessions from DynamoDB
          allFetchedSessions.forEach(session => {
            // Skip if this is the current active session
            if (currentSession && session.id === currentSession.id) {
              return;
            }
            store.put({
              ...session,
              status: 'completed', // All sessions from DynamoDB are completed
              syncStatus: 'synced',
              lastSynced: new Date().toISOString()
            });
          });
        });
      });
    } catch (error) {
      console.error('Error during full sync:', error);
      throw error;
    }
  }
}; 