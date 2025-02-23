'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import GymCheckInList from '@/components/Gym/GymCheckInList';
import { useGymStore } from '@/stores/gym/store';

export default function GymCheckInPage() {
  const router = useRouter();
  const { currentSession, checkIn, checkOut } = useGymStore();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8 transform hover:scale-105 transition-transform duration-200" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E4E5F]">Gym Check-ins</h1>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Button
              variant="secondary"
              onClick={() => router.push('/')}
              className="w-full sm:w-auto"
            >
              Back to Home
            </Button>
            <Button
              variant={currentSession ? 'primary' : 'secondary'}
              onClick={currentSession ? checkOut : checkIn}
              className="w-full sm:w-auto"
            >
              {currentSession ? 'Check-out' : 'Check-in'}
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="mb-6">
          <GymCheckInList />
        </div>
      </div>
    </div>
  );
} 