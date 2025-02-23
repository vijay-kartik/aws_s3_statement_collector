import { useEffect, useState } from 'react';
import { useGymStore } from '@/stores/gym/store';
import { Button } from '@/components/ui/Button';

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

  // State to track current session duration
  const [currentDuration, setCurrentDuration] = useState<string>('');

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
    <div className="space-y-3 sm:space-y-4">
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
        <div className="bg-[#1E4E5F] text-white p-3 sm:p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Current Session</div>
              <div className="text-sm">Check-in: {formatDateTime(currentSession.checkInTime)}</div>
              <div className="text-[#E6D5CC] mt-1 sm:mt-2 text-sm">
                Session duration: {currentDuration}
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={abandonSession}
              className="text-[#E6D5CC] hover:text-white hover:bg-red-500/20 p-1.5"
              title="Dismiss session"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      )}
      
      {/* Session list */}
      <div className="space-y-2 sm:space-y-3">
        {sessions.map((session) => (
          <div 
            key={session.id} 
            className={`bg-white p-3 sm:p-4 rounded-lg shadow-sm border transition-colors duration-200 ${
              isEditing 
                ? 'border-[#1E4E5F] cursor-pointer hover:bg-gray-50' 
                : 'border-gray-100'
            } ${selectedSessions.has(session.id) ? 'bg-[#1E4E5F]/5' : ''}`}
            onClick={() => isEditing && toggleSessionSelection(session.id)}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              {isEditing && (
                <div className="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    checked={selectedSessions.has(session.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSessionSelection(session.id);
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-[#1E4E5F] focus:ring-[#1E4E5F]"
                  />
                </div>
              )}
              <div className="flex-grow min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500">Check-in</div>
                    <div className="text-sm sm:text-base font-medium truncate">{formatDateTime(session.checkInTime)}</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500">Check-out</div>
                    <div className="text-sm sm:text-base font-medium truncate">{formatDateTime(session.checkOutTime!)}</div>
                  </div>
                </div>
                <div className="mt-1 sm:mt-2 text-[#1E4E5F] text-sm sm:text-base font-semibold">
                  Duration: {session.duration}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 