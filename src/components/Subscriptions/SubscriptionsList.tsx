'use client';

import { useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import SubscriptionItem from './SubscriptionItem';
import { useSubscriptionStore } from '@/stores/subscription/store';

export default function SubscriptionsList() {
  const { subscriptions, loading, error, fetchSubscriptions, deleteSubscription } = useSubscriptionStore();

  useEffect(() => {
    void fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleRefresh = useCallback(async () => {
    try {
      await fetchSubscriptions(true);
      toast.success('Subscriptions refreshed');
    } catch (err) {
      console.error('Error refreshing subscriptions:', err);
      toast.error('Failed to refresh subscriptions');
    }
  }, [fetchSubscriptions]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) {
      return;
    }

    try {
      await deleteSubscription(id);
      toast.success('Subscription deleted successfully');
    } catch (err) {
      console.error('Error deleting subscription:', err);
      toast.error('Failed to delete subscription');
    }
  }, [deleteSubscription]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-[#1E4E5F]">Loading subscriptions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-red-400 mb-4">{error}</p>
        <Button variant="secondary" onClick={handleRefresh}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="bg-[#1E4E5F] rounded-lg shadow-xl">
      <div className="flex justify-between items-center p-4 border-b border-[#E6D5CC]/20">
        <h2 className="text-lg font-semibold text-[#E6D5CC]">Your Subscriptions</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="text-[#E6D5CC] hover:text-white p-2"
          title={loading ? "Refreshing..." : "Refresh subscriptions"}
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
            className={`${loading ? 'animate-spin' : ''} transition-transform hover:scale-110`}
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M8 16H3v5"/>
          </svg>
          <span className="hidden sm:inline-block ml-2 text-sm">
            {loading ? 'Refreshing...' : 'Refresh'}
          </span>
        </Button>
      </div>

      {subscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8">
          <p className="text-[#E6D5CC]">No subscriptions found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-full divide-y divide-[#E6D5CC]/20">
            <div className="bg-[#1E4E5F]/80 hidden sm:block">
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 px-6 py-3">
                <div className="text-left text-xs font-medium text-[#E6D5CC] uppercase tracking-wider">Name</div>
                <div className="text-left text-xs font-medium text-[#E6D5CC] uppercase tracking-wider">Amount</div>
                <div className="text-left text-xs font-medium text-[#E6D5CC] uppercase tracking-wider">Billing Cycle</div>
                <div className="text-left text-xs font-medium text-[#E6D5CC] uppercase tracking-wider">Next Payment</div>
                <div className="text-left text-xs font-medium text-[#E6D5CC] uppercase tracking-wider">Status</div>
                <div className="text-right text-xs font-medium text-[#E6D5CC] uppercase tracking-wider">Actions</div>
              </div>
            </div>
            <div className="divide-y divide-[#E6D5CC]/20">
              {subscriptions.map((subscription) => (
                <SubscriptionItem
                  key={subscription.id}
                  subscription={subscription}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 