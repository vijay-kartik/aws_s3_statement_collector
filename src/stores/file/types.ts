import { S3File } from '@/types';

export interface FileState {
  files: S3File[];
  isLoading: boolean;
  error: string | null;
}

export interface FileActions {
  setFiles: (files: S3File[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchFiles: (forceRefresh?: boolean) => Promise<void>;
  uploadFile: (file: File) => Promise<void>;
  deleteFile: (filename: string) => Promise<void>;
  analyzeFile: (filename: string) => void;
} 