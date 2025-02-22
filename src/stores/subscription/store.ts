import { create } from 'zustand';
import { Subscription } from '@/types/subscription';

interface SubscriptionStore {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  fetchSubscriptions: (forceRefresh?: boolean) => Promise<void>;
  addSubscription: (subscription: Omit<Subscription, 'id' | 'status' | 'nextPaymentDate' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscriptions: [],
  loading: false,
  error: null,

  fetchSubscriptions: async (forceRefresh = false) => {
    // Check cache first if not forcing refresh
    if (!forceRefresh) {
      const cachedData = localStorage.getItem('cachedSubscriptions');
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData) as Subscription[];
          set({ subscriptions: parsedData });
          return;
        } catch (error) {
          console.error('Error parsing cached subscriptions:', error);
          localStorage.removeItem('cachedSubscriptions');
        }
      }
    }

    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/subscriptions');
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }
      const data = await response.json() as { subscriptions: Subscription[] };
      set({ subscriptions: data.subscriptions });
      
      // Update cache
      localStorage.setItem('cachedSubscriptions', JSON.stringify(data.subscriptions));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch subscriptions';
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },

  addSubscription: async (subscription) => {
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error('Failed to add subscription');
      }

      const newSubscription = await response.json() as Subscription;
      const updatedSubscriptions = [...get().subscriptions, newSubscription];
      set({ subscriptions: updatedSubscriptions });
      
      // Update cache
      localStorage.setItem('cachedSubscriptions', JSON.stringify(updatedSubscriptions));
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to add subscription');
    }
  },

  deleteSubscription: async (id) => {
    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete subscription');
      }

      const updatedSubscriptions = get().subscriptions.filter(sub => sub.id !== id);
      set({ subscriptions: updatedSubscriptions });
      
      // Update cache
      localStorage.setItem('cachedSubscriptions', JSON.stringify(updatedSubscriptions));
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete subscription');
    }
  },
})); 