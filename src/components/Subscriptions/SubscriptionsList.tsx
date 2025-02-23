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
                <div key={subscription.id} className="hover:bg-[#1E4E5F]/80 transition-colors">
                  {/* Mobile view */}
                  <div className="block sm:hidden p-4">
                    <div className="relative">
                      <button
                        onClick={() => void handleDelete(subscription.id)}
                        className="absolute top-0 right-0 p-2 text-red-300 hover:text-red-100 hover:bg-red-500/20 rounded-full transition-colors"
                        title="Delete subscription"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                      <div className="pr-8">
                        <h3 className="text-[#E6D5CC] font-medium text-base mb-1">{subscription.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#E6D5CC]/10 text-[#E6D5CC]">
                            {subscription.billingCycle}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full
                            ${subscription.status === 'active' 
                              ? 'bg-green-900/50 text-green-200'
                              : 'bg-red-900/50 text-red-200'
                            }`}
                          >
                            {subscription.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline text-[#E6D5CC]">
                          <span className="text-lg font-semibold">{formatCurrency(subscription.amount)}</span>
                          <div className="text-right">
                            <div className="text-xs text-[#E6D5CC]/80">Next payment</div>
                            <div className="text-sm">{formatDate(subscription.nextPaymentDate)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop view */}
                  <div className="hidden sm:grid sm:grid-cols-6 gap-4 p-4 sm:px-6 sm:py-4">
                    <div className="text-sm font-medium text-[#E6D5CC]">{subscription.name}</div>
                    <div className="text-sm text-[#E6D5CC]">{formatCurrency(subscription.amount)}</div>
                    <div className="text-sm text-[#E6D5CC]">{subscription.billingCycle}</div>
                    <div className="text-sm text-[#E6D5CC]">{formatDate(subscription.nextPaymentDate)}</div>
                    <div className="flex">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full w-fit
                        ${subscription.status === 'active' 
                          ? 'bg-green-900/50 text-green-200'
                          : 'bg-red-900/50 text-red-200'
                        }`}
                      >
                        {subscription.status}
                      </span>
                    </div>
                    <div className="flex justify-end">
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