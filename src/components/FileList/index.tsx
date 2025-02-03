import { useState } from 'react';
import { toast } from 'react-toastify';
import { S3File } from '@/types';
import { s3Service } from '@/services/s3Service';
import { formatFileSize } from '@/utils/formatters';
import { FileListHeader } from '@/components/FileList/FileListHeader';
import { FileListTable } from '@/components/FileList/FileListTable';

interface FileListProps {
  files: S3File[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
}

export default function FileList({ files, isLoading, onRefresh }: FileListProps) {
  const handleDelete = async (filename: string) => {
    if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
      try {
        await s3Service.deleteFile(filename);
        toast.success('File deleted successfully');
        onRefresh();
      } catch (error) {
        console.error('Error deleting file:', error);
        toast.error('Failed to delete file');
      }
    }
  };

  const handleAnalyse = (filename: string) => {
    toast.info('Analysis feature coming soon!');
  };

  return (
    <div className="mt-8">
      <FileListHeader isLoading={isLoading} onRefresh={onRefresh} />
      
      {isLoading ? (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No files uploaded yet</p>
          <button
            onClick={onRefresh}
            className="text-blue-500 hover:text-blue-600 underline"
          >
            Click to load files
          </button>
        </div>
      ) : (
        <FileListTable 
          files={files} 
          onDelete={handleDelete} 
          onAnalyse={handleAnalyse}
          formatFileSize={formatFileSize}
        />
      )}
    </div>
  );
} 