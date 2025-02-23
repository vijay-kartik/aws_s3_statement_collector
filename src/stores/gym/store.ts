import { create } from 'zustand';

interface GymSession {
  id: string;
  checkInTime: string;
  checkOutTime?: string;
  duration?: string;
}

interface GymStore {
  currentSession: GymSession | null;
  sessions: GymSession[];
  isEditing: boolean;
  selectedSessions: Set<string>;
  checkIn: () => void;
  checkOut: () => void;
  getSessions: () => GymSession[];
  toggleEditing: () => void;
  toggleSessionSelection: (id: string) => void;
  clearSelection: () => void;
  deleteSelectedSessions: () => void;
}

export const useGymStore = create<GymStore>((set, get) => ({
  currentSession: null,
  sessions: [],
  isEditing: false,
  selectedSessions: new Set<string>(),

  checkIn: () => {
    // Create a new session with current timestamp
    const newSession = {
      id: new Date().getTime().toString(),
      checkInTime: new Date().toISOString(),
    };

    // Save to local storage
    localStorage.setItem('currentGymSession', JSON.stringify(newSession));
    set({ currentSession: newSession });
  },

  checkOut: () => {
    const currentSession = get().currentSession;
    if (!currentSession) return;

    // Add checkout time
    const checkOutTime = new Date().toISOString();
    const completedSession = {
      ...currentSession,
      checkOutTime,
      duration: calculateDuration(new Date(currentSession.checkInTime), new Date(checkOutTime)),
    };

    // Get existing sessions from localStorage
    const existingSessions = JSON.parse(localStorage.getItem('gymSessions') || '[]');
    const updatedSessions = [...existingSessions, completedSession];

    // Save to localStorage
    localStorage.setItem('gymSessions', JSON.stringify(updatedSessions));
    localStorage.removeItem('currentGymSession');

    // Update state
    set({ 
      currentSession: null,
      sessions: updatedSessions,
    });
  },

  getSessions: () => {
    // Get sessions from localStorage
    const sessions = JSON.parse(localStorage.getItem('gymSessions') || '[]');
    const currentSession = JSON.parse(localStorage.getItem('currentGymSession') || 'null');
    
    set({ 
      sessions,
      currentSession,
    });
    
    return sessions;
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

  deleteSelectedSessions: () => {
    const { sessions, selectedSessions } = get();
    
    // Filter out selected sessions
    const updatedSessions = sessions.filter(session => !selectedSessions.has(session.id));
    
    // Update localStorage
    localStorage.setItem('gymSessions', JSON.stringify(updatedSessions));
    
    // Update state
    set({
      sessions: updatedSessions,
      selectedSessions: new Set(),
      isEditing: false
    });
  },
}));

function calculateDuration(startTime: Date, endTime: Date): string {
  const diff = endTime.getTime() - startTime.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
} 