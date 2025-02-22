import { create } from 'zustand';
import { FileState, FileActions } from './types';
import { fileService } from '@/services/fileService';
import { toast } from 'react-toastify';

type FileStore = FileState & FileActions;

export const useFileStore = create<FileStore>((set, get) => ({
  // State
  files: [],
  isLoading: false,
  error: null,

  // Actions
  setFiles: (files) => set({ files }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchFiles: async (forceRefresh = false) => {
    // Check cache first if not forcing refresh
    if (!forceRefresh) {
      const cachedData = localStorage.getItem('cachedFiles');
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          set({ files: parsedData });
          return;
        } catch (error) {
          console.error('Error parsing cached files:', error);
          localStorage.removeItem('cachedFiles');
        }
      }
    }

    set({ isLoading: true, error: null });
    try {
      const files = await fileService.listFiles();
      set({ files });
      localStorage.setItem('cachedFiles', JSON.stringify(files));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch files';
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  uploadFile: async (file) => {
    set({ isLoading: true, error: null });
    try {
      await fileService.uploadFile(file);
      await get().fetchFiles(true);
      toast.success('File uploaded successfully! 🎉');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteFile: async (filename) => {
    try {
      await fileService.deleteFile(filename);
      const files = get().files.filter(file => file.name !== filename);
      set({ files });
      localStorage.setItem('cachedFiles', JSON.stringify(files));
      toast.success('File deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete file';
      toast.error(errorMessage);
      throw error;
    }
  },

  analyzeFile: (filename) => {
    fileService.analyzeFile(filename);
  },
})); 