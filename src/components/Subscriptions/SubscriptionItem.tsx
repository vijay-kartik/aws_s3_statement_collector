import { Button } from '@/components/ui/Button';
import { Subscription } from '@/types/subscription';
import { formatCurrency, formatDate } from '@/utils/format';

interface SubscriptionItemProps {
  subscription: Subscription;
  onDelete: (id: string) => void;
}

export default function SubscriptionItem({ subscription, onDelete }: SubscriptionItemProps) {
  return (
    <div className="hover:bg-[#1E4E5F]/80 transition-colors">
      {/* Mobile view */}
      <div className="block sm:hidden p-4">
        <div className="relative">
          <button
            onClick={() => void onDelete(subscription.id)}
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
            onClick={() => void onDelete(subscription.id)}
            className="w-full sm:w-auto"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
} 