import { GymSession } from '@/types/gym';
import { formatDateTime } from '@/utils/datetime';

interface GymCheckInItemProps {
  session: GymSession;
  isEditing: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function GymCheckInItem({ 
  session, 
  isEditing, 
  isSelected,
  onSelect 
}: GymCheckInItemProps) {
  const isCompleted = session.status === 'completed';

  return (
    <div 
      className={`bg-white p-3 sm:p-4 rounded-lg shadow-sm border transition-colors duration-200 ${
        isEditing 
          ? 'border-[#1E4E5F] cursor-pointer hover:bg-gray-50' 
          : 'border-gray-100'
      } ${isSelected ? 'bg-[#1E4E5F]/5' : ''}`}
      onClick={() => isEditing && onSelect(session.id)}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {isEditing && (
          <div className="flex-shrink-0 pt-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect(session.id);
              }}
              className="h-4 w-4 rounded border-gray-300 text-[#1E4E5F] focus:ring-[#1E4E5F]"
            />
          </div>
        )}
        <div className="flex-grow min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
            <div>
              <div className="text-xs sm:text-sm text-gray-500">Check-in</div>
              <div className="text-sm sm:text-base font-medium truncate">
                {formatDateTime(session.checkInTime)}
              </div>
            </div>
            {isCompleted && session.checkOutTime && (
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Check-out</div>
                <div className="text-sm sm:text-base font-medium truncate">
                  {formatDateTime(session.checkOutTime)}
                </div>
              </div>
            )}
          </div>
          {isCompleted && session.duration && (
            <div className="mt-1 sm:mt-2 text-[#1E4E5F] text-sm sm:text-base font-semibold">
              Duration: {session.duration}
            </div>
          )}
          {!isCompleted && (
            <div className="mt-1 sm:mt-2 text-green-600 text-sm sm:text-base font-semibold">
              In Progress
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 