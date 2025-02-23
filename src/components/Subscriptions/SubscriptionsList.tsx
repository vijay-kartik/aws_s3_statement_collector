'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/utils/format';
import { useSubscriptionStore } from '@/stores/subscription/store';

export default function SubscriptionsList() {
  const { subscriptions, loading, error, fetchSubscriptions, deleteSubscription } = useSubscriptionStore();

  // Sort subscriptions by next payment date
  const sortedSubscriptions = useMemo(() => {
    return [...subscriptions].sort((a, b) => {
      return new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime();
    });
  }, [subscriptions]);

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
        <div className="text-gray-300">Loading subscriptions...</div>
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
    <div className="bg-gray-900 rounded-lg">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-100">Your Subscriptions</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700"
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

      {sortedSubscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8">
          <p className="text-gray-400">No subscriptions found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Billing Cycle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Next Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700">
              {sortedSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-100">
                        {subscription.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {formatCurrency(subscription.amount, subscription.currency)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {subscription.billingCycle}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {formatDate(subscription.nextPaymentDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${subscription.status === 'active' 
                        ? 'bg-green-900 text-green-200'
                        : 'bg-red-900 text-red-200'
                      }`}
                    >
                      {subscription.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => void handleDelete(subscription.id)}
                      className="ml-2 bg-red-900 hover:bg-red-800 text-red-100"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 