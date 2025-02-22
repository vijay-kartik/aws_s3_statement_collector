'use client';

import { useState } from 'react';
import SubscriptionsList from '@/components/Subscriptions/SubscriptionsList';
import AddSubscriptionModal from '@/components/Subscriptions/AddSubscriptionModal';
import { Button } from '@/components/ui/Button';

export default function SubscriptionsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
        </div>

        {/* Main content */}
        <div className="mb-6">
          <SubscriptionsList />
        </div>

        {/* Add Subscription Button */}
        <div className="flex justify-center">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            variant="primary"
            size="lg"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
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