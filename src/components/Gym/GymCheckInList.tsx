import { useEffect, useState, useCallback } from 'react';
import { useGymStore } from '@/stores/gym/store';
import { Button } from '@/components/ui/Button';
import GymCheckInItem from './GymCheckInItem';
import CurrentGymSession from './CurrentGymSession';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import PullToRefreshIndicator from '@/components/ui/PullToRefreshIndicator';

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
}

export default function GymCheckInList() {
  const { 
    sessions, 
    getSessions, 
    currentSession,
    isEditing,
    selectedSessions,
    toggleEditing,
    toggleSessionSelection,
    deleteSelectedSessions,
    getSessionDuration,
    abandonSession
  } = useGymStore();

  // State to track current session duration and refresh state
  const [currentDuration, setCurrentDuration] = useState<string>('');

  const {
    isPulling,
    pullDistance,
    isRefreshing,
    threshold
  } = usePullToRefresh({
    onRefresh: async () => { await getSessions(); }
  });

  useEffect(() => {
    getSessions();
  }, [getSessions]);

  // Update duration every minute when there's an active session
  useEffect(() => {
    if (!currentSession) {
      setCurrentDuration('');
      return;
    }

    // Initial duration
    setCurrentDuration(getSessionDuration(currentSession.checkInTime));

    // Update duration every minute
    const interval = setInterval(() => {
      setCurrentDuration(getSessionDuration(currentSession.checkInTime));
    }, 60000); // every minute

    return () => clearInterval(interval);
  }, [currentSession, getSessionDuration]);

  if (sessions.length === 0 && !currentSession) {
    return (
      <div className="text-center text-gray-500 py-4 sm:py-8">
        No gym sessions recorded yet
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 relative">
      <PullToRefreshIndicator
        isPulling={isPulling}
        pullDistance={pullDistance}
        isRefreshing={isRefreshing}
        threshold={threshold}
      />

      <div 
        className="transition-transform"
        style={{ 
          transform: isPulling ? `translateY(${pullDistance}px)` : 'none'
        }}
      >
        {/* Header with edit controls */}
        {sessions.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-[#1E4E5F]">
              {isEditing ? 'Select sessions to delete' : 'Session History'}
            </h2>
            <div className="flex gap-2 w-full sm:w-auto">
              {isEditing ? (
                <>
                  <Button
                    variant="danger"
                    onClick={deleteSelectedSessions}
                    disabled={selectedSessions.size === 0}
                    className="flex-1 sm:flex-initial text-xs sm:text-sm py-1.5"
                  >
                    Delete Selected ({selectedSessions.size})
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={toggleEditing}
                    className="flex-1 sm:flex-initial text-xs sm:text-sm py-1.5"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  onClick={toggleEditing}
                  className="flex-1 sm:flex-initial text-xs sm:text-sm py-1.5"
                >
                  Edit
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Current session card */}
        {currentSession && (
          <CurrentGymSession
            session={currentSession}
            duration={currentDuration}
            onAbandon={abandonSession}
          />
        )}
        
        {/* Session list */}
        <div className="space-y-2 sm:space-y-3">
          {sessions.map((session) => (
            <GymCheckInItem
              key={session.id}
              session={session}
              isEditing={isEditing}
              isSelected={selectedSessions.has(session.id)}
              onSelect={toggleSessionSelection}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 