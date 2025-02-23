export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled';
export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';
export type Currency = 'INR' | 'USD';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  billingCycle: BillingCycle;
  nextPaymentDate: string;
  status: SubscriptionStatus;
  description?: string;
  startDate: string;
  endDate?: string;
  lastPaymentDate?: string;
  createdAt: string;
  updatedAt: string;
} 