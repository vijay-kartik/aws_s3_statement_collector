import { Button } from '@/components/ui/Button';
import { GymSession } from '@/types/gym';
import { formatDateTime } from '@/utils/datetime';

interface CurrentGymSessionProps {
  session: GymSession;
  duration: string;
  onAbandon: () => void;
}

export default function CurrentGymSession({ 
  session, 
  duration,
  onAbandon 
}: CurrentGymSessionProps) {
  return (
    <div className="bg-[#1E4E5F] text-white p-3 sm:p-4 rounded-lg">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Current Session</div>
          <div className="text-sm">Check-in: {formatDateTime(session.checkInTime)}</div>
          <div className="text-[#E6D5CC] mt-1 sm:mt-2 text-sm">
            Session duration: {duration}
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={onAbandon}
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
  );
} 