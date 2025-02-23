"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-16 sm:pt-24 text-center">
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">Welcome Kartik!</h1>
            <div className="h-1 w-24 bg-blue-600 mx-auto"></div>
          </div>
          <p className="text-lg text-gray-600 mb-8 px-4 sm:px-0">
            Analyze and manage your credit card statements and subscriptions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/cc_statement_analyser')}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-lg px-8"
            >
              <span>Go to Statement Analyzer</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Button>
            <Button
              onClick={() => router.push('/subs')}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-lg px-8"
            >
              <span>See Subscriptions</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
