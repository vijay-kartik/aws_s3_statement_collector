import { toast } from 'react-toastify';

export const errorHandler = {
  handle(error: unknown, customMessage?: string) {
    console.error('Error:', error);
    
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error(customMessage || 'An unexpected error occurred');
    }
  },

  async wrapAsync<T>(
    promise: Promise<T>,
    errorMessage: string
  ): Promise<T | undefined> {
    try {
      return await promise;
    } catch (error) {
      this.handle(error, errorMessage);
      return undefined;
    }
  }
}; 