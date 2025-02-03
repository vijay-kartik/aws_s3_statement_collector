import { S3File } from '@/types';

export const s3Service = {
  async listFiles(): Promise<S3File[]> {
    const response = await fetch('/api/s3-list');
    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }
    const data = await response.json();
    return data.files;
  },

  async deleteFile(filename: string): Promise<void> {
    const response = await fetch(`/api/s3-delete?filename=${encodeURIComponent(filename)}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
  },

  async getPresignedUrl(filename: string, filetype: string) {
    const response = await fetch("/api/s3-presigned", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filename, filetype }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get presigned URL: ${response.status} ${errorText}`);
    }

    return response.json();
  }
}; 