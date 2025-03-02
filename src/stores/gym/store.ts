import { create } from 'zustand';
import { toast } from 'react-toastify';
import { GymSession } from '@/types/gym';
import { getDB } from '@/services/indexedDB';
import { syncService } from '@/services/syncService';


interface GymStore {
  currentSession: GymSession | null;
  sessions: GymSession[];
  isEditing: boolean;
  selectedSessions: Set<string>;
  checkIn: () => Promise<void>;
  checkOut: () => Promise<void>;
  abandonSession: () => void;
  getSessions: () => Promise<GymSession[]>;
  toggleEditing: () => void;
  toggleSessionSelection: (id: string) => void;
  clearSelection: () => void;
  deleteSelectedSessions: () => Promise<void>;
  getSessionDuration: (checkInTime: string) => string;
}

export const useGymStore = create<GymStore>((set, get) => ({
  currentSession: null,
  sessions: [],
  isEditing: false,
  selectedSessions: new Set<string>(),

  checkIn: async () => {
    try {
      const dbInstance = await getDB();
      if (!dbInstance) {
        toast.error('Database not available');
        return;
      }

      // Create a new session with current timestamp
      const newSession: GymSession = {
        id: new Date().getTime().toString(),
        checkInTime: new Date().toISOString(),
        status: 'active',
        syncStatus: 'pending'
      };

      // Save to IndexedDB and sync queue
      await dbInstance.add('sessions', newSession);
      await syncService.addToSyncQueue('create', newSession);
      
      // Process sync queue if online
      syncService.processSyncQueue().catch(console.error);

      // Save current session state
      localStorage.setItem('currentGymSession', JSON.stringify(newSession));
      set({ currentSession: newSession });

      // Show toast notification
      toast.success('Gym session started! View details in Gym Check-ins');
    } catch (error) {
      console.error('Error during check-in:', error);
      toast.error('Failed to start gym session');
    }
  },

  checkOut: async () => {
    try {
      const currentSession = get().currentSession;
      if (!currentSession) return;

      const dbInstance = await getDB();
      if (!dbInstance) {
        toast.error('Database not available');
        return;
      }

      // Add checkout time
      const checkOutTime = new Date().toISOString();
      const duration = calculateDuration(new Date(currentSession.checkInTime), new Date(checkOutTime));
      
      const completedSession: GymSession = {
        ...currentSession,
        checkOutTime,
        duration,
        status: 'completed',
        syncStatus: 'pending'
      };

      // Save to IndexedDB and sync queue
      await dbInstance.put('sessions', completedSession);
      await syncService.addToSyncQueue('update', completedSession);
      
      // Process sync queue if online
      syncService.processSyncQueue().catch(console.error);

      // Update local storage and state
      localStorage.removeItem('currentGymSession');
      set({ 
        currentSession: null,
        sessions: [...get().sessions, completedSession],
      });

      // Show toast with session duration
      toast.success(`Gym session completed! Duration: ${duration}`);
    } catch (error) {
      console.error('Error during check-out:', error);
      toast.error('Failed to complete gym session');
    }
  },

  abandonSession: () => {
    const currentSession = get().currentSession;
    if (!currentSession) return;

    // Remove from localStorage
    localStorage.removeItem('currentGymSession');

    // Update state
    set({ currentSession: null });

    // Show toast notification
    toast.info('Gym session abandoned');
  },

  getSessions: async () => {
    try {
      const dbInstance = await getDB();
      if (!dbInstance) {
        toast.error('Database not available');
        return [];
      }

      // Get sessions from IndexedDB
      const allSessions = await dbInstance.getAll('sessions');
      
      // Get current session from localStorage
      const currentSession = JSON.parse(localStorage.getItem('currentGymSession') || 'null') as GymSession | null;
      
      // Sort sessions by check-in time (newest first)
      const sortedSessions = allSessions.sort((a, b) => 
        new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
      );

      set({ 
        sessions: sortedSessions,
        currentSession,
      });
      
      return sortedSessions;
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast.error('Failed to load sessions');
      return [];
    }
  },

  toggleEditing: () => {
    set((state) => ({ 
      isEditing: !state.isEditing,
      selectedSessions: new Set() // Clear selection when toggling edit mode
    }));
  },

  toggleSessionSelection: (id: string) => {
    set((state) => {
      const newSelection = new Set(state.selectedSessions);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return { selectedSessions: newSelection };
    });
  },

  clearSelection: () => {
    set({ selectedSessions: new Set() });
  },

  deleteSelectedSessions: async () => {
    try {
      const { sessions, selectedSessions } = get();
      const dbInstance = await getDB();
      if (!dbInstance) {
        toast.error('Database not available');
        return;
      }
      
      const selectedSessionsArray = sessions.filter(session => selectedSessions.has(session.id));
      
      // Delete from IndexedDB and add to sync queue
      for (const session of selectedSessionsArray) {
        // Only delete completed sessions from DynamoDB
        if (session.status === 'completed') {
          await dbInstance.delete('sessions', session.id);
          await syncService.addToSyncQueue('delete', session);
        }
      }
      
      // Process sync queue if online
      await syncService.processSyncQueue();
      
      // Update state
      const updatedSessions = sessions.filter(session => !selectedSessions.has(session.id));
      set({
        sessions: updatedSessions,
        selectedSessions: new Set(),
        isEditing: false
      });

      toast.success(`${selectedSessions.size} session(s) deleted`);
    } catch (error) {
      console.error('Error deleting sessions:', error);
      toast.error('Failed to delete sessions');
    }
  },

  getSessionDuration: (checkInTime: string) => {
    return calculateDuration(new Date(checkInTime), new Date());
  },
}));

function calculateDuration(startTime: Date, endTime: Date): string {
  const diff = endTime.getTime() - startTime.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
} 