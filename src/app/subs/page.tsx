'use client';

import { useState } from 'react';
import SubscriptionsList from '@/components/Subscriptions/SubscriptionsList';
import AddSubscriptionModal from '@/components/Subscriptions/AddSubscriptionModal';
import { Button } from '@/components/ui/Button';

export default function SubscriptionsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Subscription Management</h1>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add Subscription
        </Button>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-lg shadow">
        <SubscriptionsList />
      </div>

      {/* Add Subscription Modal */}
      <AddSubscriptionModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
} 