import { memo } from 'react';
import { S3File } from '@/types';
import { AnalyseIcon, DeleteIcon } from '@/components/icons';

interface FileListRowProps {
  file: S3File;
  onDelete: (filename: string) => Promise<void>;
  onAnalyse: (filename: string) => void;
  formatFileSize: (bytes: number) => string;
}

export const FileListRow = memo(function FileListRow({ 
  file, 
  onDelete, 
  onAnalyse,
  formatFileSize 
}: FileListRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-1/2 md:w-auto">
        {file.name}
      </td>
      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatFileSize(file.size)}
      </td>
      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(file.lastModified).toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onAnalyse(file.name)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Analyse document"
          >
            <AnalyseIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(file.name)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Delete document"
          >
            <DeleteIcon className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}); 