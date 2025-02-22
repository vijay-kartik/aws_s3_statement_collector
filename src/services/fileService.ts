import { S3File } from '@/types';

class FileService {
  async listFiles(): Promise<S3File[]> {
    const response = await fetch('/api/s3-list');
    if (!response.ok) {
      throw new Error(`Failed to fetch files: ${response.statusText}`);
    }
    const data = await response.json();
    return data.files.map((file: S3File) => ({
      ...file,
      lastModified: file.lastModified instanceof Date ? file.lastModified.toISOString() : file.lastModified
    }));
  }

  async uploadFile(file: File): Promise<void> {
    const { url, fields } = await this.getPresignedUrl(file.name, file.type);
    
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append('file', file);

    const uploadResponse = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Upload failed: ${uploadResponse.status} ${errorText}`);
    }
  }

  async deleteFile(filename: string): Promise<void> {
    const response = await fetch(`/api/s3-delete?filename=${encodeURIComponent(filename)}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.statusText}`);
    }
  }

  async getPresignedUrl(filename: string, filetype: string): Promise<{ url: string; fields: Record<string, string> }> {
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

  analyzeFile(filename: string): void {
    window.location.href = `/analysis/${encodeURIComponent(filename)}`;
  }
}

export const fileService = new FileService(); 