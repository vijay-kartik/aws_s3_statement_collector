'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

export default function GymCheckinPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8 transform hover:scale-105 transition-transform duration-200" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E4E5F]">My Gym Check-ins</h1>
          </div>
          <Button
            variant="secondary"
            onClick={() => router.push('/')}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back Home</span>
          </Button>
        </div>

        {/* Main content will go here */}
        <div className="bg-[#1E4E5F] rounded-lg shadow-xl p-6">
          <div className="text-center text-[#E6D5CC]">
            Coming soon...
          </div>
        </div>
      </div>
    </div>
  );
} 