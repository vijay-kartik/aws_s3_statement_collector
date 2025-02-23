'use client';

import { useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/utils/format';
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-[#E6D5CC]/20 gap-4">
        <h2 className="text-lg font-semibold text-[#E6D5CC]">Your Subscriptions</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-[#E6D5CC] hover:text-white"
          title="Refresh subscriptions"
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
          {!loading && <span className="text-sm">Refresh</span>}
          {loading && <span className="text-sm">Refreshing...</span>}
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
                <div key={subscription.id} className="hover:bg-[#1E4E5F]/80 transition-colors">
                  <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 p-4 sm:px-6 sm:py-4">
                    <div className="flex flex-col sm:block">
                      <div className="text-sm font-medium text-[#E6D5CC] sm:hidden">Name:</div>
                      <div className="text-sm font-medium text-[#E6D5CC]">{subscription.name}</div>
                    </div>
                    <div className="flex flex-col sm:block">
                      <div className="text-sm font-medium text-[#E6D5CC] sm:hidden">Amount:</div>
                      <div className="text-sm text-[#E6D5CC]">{formatCurrency(subscription.amount)}</div>
                    </div>
                    <div className="flex flex-col sm:block">
                      <div className="text-sm font-medium text-[#E6D5CC] sm:hidden">Billing Cycle:</div>
                      <div className="text-sm text-[#E6D5CC]">{subscription.billingCycle}</div>
                    </div>
                    <div className="flex flex-col sm:block">
                      <div className="text-sm font-medium text-[#E6D5CC] sm:hidden">Next Payment:</div>
                      <div className="text-sm text-[#E6D5CC]">{formatDate(subscription.nextPaymentDate)}</div>
                    </div>
                    <div className="flex flex-col sm:block">
                      <div className="text-sm font-medium text-[#E6D5CC] sm:hidden">Status:</div>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${subscription.status === 'active' 
                          ? 'bg-green-900/50 text-green-200'
                          : 'bg-red-900/50 text-red-200'
                        }`}
                      >
                        {subscription.status}
                      </span>
                    </div>
                    <div className="flex justify-start sm:justify-end mt-4 sm:mt-0">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => void handleDelete(subscription.id)}
                        className="w-full sm:w-auto"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 