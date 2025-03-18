"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { useGymStore } from '@/stores/gym/store';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const { currentSession, checkIn, checkOut, getSessions } = useGymStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true once the component is mounted
    setIsClient(true);
    
    // Load sessions on mount (only on client side)
    getSessions();
  }, [getSessions]);

  return (
    <main className="min-h-screen bg-[#E6D5CC] bg-opacity-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-6">
          <Logo className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-[#1E4E5F]">
            Welcome to Elucida
          </h1>
          <div className="h-1 w-20 bg-[#1E4E5F] mx-auto mb-4"></div>
          <p className="text-lg text-[#2D3436] mb-8">
            Analyze and manage your credit card statements and subscriptions
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              variant="primary"
              onClick={() => router.push('/cc_statement_analyser')}
              className="w-full sm:w-auto"
            >
              Statement Analyzer
            </Button>
            <Button
              variant="primary"
              onClick={() => router.push('/subs')}
              className="w-full sm:w-auto"
            >
              Subscriptions
            </Button>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Button
              variant="primary"
              onClick={() => router.push('/gym_checkin')}
              className="w-full sm:w-auto"
            >
              Gym Check-ins
            </Button>
            {isClient && (
              <Button
                variant="secondary"
                onClick={currentSession ? checkOut : checkIn}
                className="w-full sm:w-auto"
              >
                {currentSession ? 'Check-out' : 'Check-in'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
