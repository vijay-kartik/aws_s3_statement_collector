export interface GymSession {
  id: string;
  checkInTime: string;
  checkOutTime?: string;
  duration?: string;
  status: 'active' | 'completed';
  syncStatus: 'pending' | 'synced' | 'failed';
  lastSynced?: string;
}

export type SyncOperation = 'create' | 'update' | 'delete';

export interface SyncQueue {
  id: string;
  operation: SyncOperation;
  data: GymSession;
  timestamp: string;
} 