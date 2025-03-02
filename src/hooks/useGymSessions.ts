import { useState, useEffect } from 'react';
import { getDB } from '@/services/indexedDB';
import { syncService } from '@/services/syncService';
import { useNetworkStatus } from './useNetworkStatus'; // You'll need to create this
import { GymSession } from '@/types/gym';

export function useGymSessions() {
  const [sessions, setSessions] = useState<GymSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isOnline = useNetworkStatus();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadSessions();
      
      // Perform full sync when coming online
      if (isOnline) {
        syncService.fullSync()
          .then(() => loadSessions())
          .catch(console.error);
      }
    }
  }, [isOnline]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      
      // Always try to sync with DynamoDB first if online
      if (isOnline) {
        await syncService.fullSync();
      }

      const dbInstance = await getDB();
      if (!dbInstance) return;

      const allSessions = await dbInstance.getAll('sessions');
      setSessions(allSessions.sort((a, b) => 
        new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
      ));
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSession = async (sessionData: Omit<GymSession, 'id' | 'syncStatus'>) => {
    const newSession: GymSession = {
      ...sessionData,
      id: crypto.randomUUID(),
      syncStatus: 'pending'
    };

    const dbInstance = await getDB();
    if (!dbInstance) return;
    await dbInstance.add('sessions', newSession);
    await syncService.addToSyncQueue('create', newSession);
    
    if (isOnline) {
      await syncService.fullSync();
    }

    await loadSessions();
  };

  const updateSession = async (session: GymSession) => {
    const dbInstance = await getDB();
    if (!dbInstance) return;
    const updatedSession: GymSession = {
      ...session,
      syncStatus: 'pending' as const
    };
    await dbInstance.put('sessions', updatedSession);
    await syncService.addToSyncQueue('update', updatedSession);
    
    if (isOnline) {
      await syncService.fullSync();
    }

    await loadSessions();
  };

  const deleteSession = async (session: GymSession) => {
    const dbInstance = await getDB();
    if (!dbInstance) return;
    await dbInstance.delete('sessions', session.id);
    await syncService.addToSyncQueue('delete', session);
    
    if (isOnline) {
      await syncService.fullSync();
    }

    await loadSessions();
  };

  const refresh = async () => {
    try {
      await syncService.fullSync();
      await loadSessions();
    } catch (error) {
      console.error('Error refreshing sessions:', error);
    }
  };

  return {
    sessions,
    isLoading,
    createSession,
    updateSession,
    deleteSession,
    refresh
  };
} 