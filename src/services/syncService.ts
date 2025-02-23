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

          // If DynamoDB sync was successful, update IndexedDB
          await new Promise((resolve, reject) => {
            const tx = dbInstance.transaction(['syncQueue', 'sessions'], 'readwrite');
            
            tx.oncomplete = () => resolve(undefined);
            tx.onerror = () => reject(tx.error);
            
            if (item.operation !== 'delete') {
              const sessionStore = tx.objectStore('sessions');
              sessionStore.put({
                ...item.data,
                syncStatus: 'synced',
                lastSynced: new Date().toISOString()
              });
            }
            
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
      // Process any pending changes first
      await this.processSyncQueue();

      // Get all months in the last year
      const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return `${date.getFullYear()}_${String(date.getMonth() + 1).padStart(2, '0')}`;
      });

      // Fetch all sessions from DynamoDB
      for (const month of months) {
        try {
          const sessions = await dynamoService.getSessionsForMonth(month);
          
          if (sessions.length > 0) {
            // Update IndexedDB with the fetched sessions
            await new Promise((resolve, reject) => {
              const tx = dbInstance.transaction('sessions', 'readwrite');
              
              tx.oncomplete = () => resolve(undefined);
              tx.onerror = () => reject(tx.error);
              
              const store = tx.objectStore('sessions');
              sessions.forEach(session => {
                store.put({
                  ...session,
                  syncStatus: 'synced',
                  lastSynced: new Date().toISOString()
                });
              });
            });
          }
        } catch (error) {
          console.error(`Error syncing month ${month}:`, error);
        }
      }
    } catch (error) {
      console.error('Error during full sync:', error);
      throw error;
    }
  }
}; 