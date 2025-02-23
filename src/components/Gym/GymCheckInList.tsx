import { useEffect } from 'react';
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
    deleteSelectedSessions
  } = useGymStore();

  useEffect(() => {
    getSessions();
  }, [getSessions]);

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
          <div className="font-semibold mb-2">Current Session</div>
          <div>Check-in: {formatDateTime(currentSession.checkInTime)}</div>
          <div className="text-[#E6D5CC]">Session in progress...</div>
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