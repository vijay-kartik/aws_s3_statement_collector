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
      <div className="text-center text-gray-500 py-8">
        No gym sessions recorded yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with edit controls */}
      {sessions.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#1E4E5F]">
            {isEditing ? 'Select sessions to delete' : 'Session History'}
          </h2>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="danger"
                  onClick={deleteSelectedSessions}
                  disabled={selectedSessions.size === 0}
                  className="text-sm"
                >
                  Delete Selected ({selectedSessions.size})
                </Button>
                <Button
                  variant="secondary"
                  onClick={toggleEditing}
                  className="text-sm"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                onClick={toggleEditing}
                className="text-sm"
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Current session card */}
      {currentSession && (
        <div className="bg-[#1E4E5F] text-white p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold mb-2">Current Session</div>
              <div>Check-in: {formatDateTime(currentSession.checkInTime)}</div>
              <div className="text-[#E6D5CC] mt-2">
                Session duration: {currentDuration}
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={abandonSession}
              className="text-[#E6D5CC] hover:text-white hover:bg-red-500/20"
              title="Dismiss session"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
      {sessions.map((session) => (
        <div 
          key={session.id} 
          className={`bg-white p-4 rounded-lg shadow-sm border transition-colors duration-200 ${
            isEditing 
              ? 'border-[#1E4E5F] cursor-pointer hover:bg-gray-50' 
              : 'border-gray-100'
          } ${selectedSessions.has(session.id) ? 'bg-[#1E4E5F]/5' : ''}`}
          onClick={() => isEditing && toggleSessionSelection(session.id)}
        >
          <div className="flex items-start gap-4">
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
            <div className="flex-grow">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <div className="text-sm text-gray-500">Check-in</div>
                  <div className="font-medium">{formatDateTime(session.checkInTime)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Check-out</div>
                  <div className="font-medium">{formatDateTime(session.checkOutTime!)}</div>
                </div>
              </div>
              <div className="mt-2 text-[#1E4E5F] font-semibold">
                Duration: {session.duration}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 