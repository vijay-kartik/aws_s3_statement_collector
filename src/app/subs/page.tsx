'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SubscriptionsList from '@/components/Subscriptions/SubscriptionsList';
import AddSubscriptionModal from '@/components/Subscriptions/AddSubscriptionModal';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

export default function SubscriptionsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Subscription Management</h1>
          </div>
          <Button
            variant="secondary"
            onClick={() => router.push('/cc_statement_analyser')}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back to Analyzer</span>
          </Button>
        </div>

        {/* Main content */}
        <div className="mb-6">
          <SubscriptionsList />
        </div>

        {/* Add Subscription Button */}
        <div className="flex justify-center px-4">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            variant="primary"
            size="lg"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg w-full sm:w-auto"
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Subscription
          </Button>
        </div>

        {/* Add Subscription Modal */}
        <AddSubscriptionModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    </div>
  );
} 