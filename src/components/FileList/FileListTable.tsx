import { S3File } from '@/types';
import { FileListRow } from './FileListRow';

interface FileListTableProps {
  files: S3File[];
  onDelete: (filename: string) => Promise<void>;
  onAnalyse: (filename: string) => void;
  formatFileSize: (bytes: number) => string;
}

export function FileListTable({ files, onDelete, onAnalyse, formatFileSize }: FileListTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2 md:w-auto">
              Name
            </th>
            <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Size
            </th>
            <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Modified
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {files.map((file) => (
            <FileListRow
              key={file.name}
              file={file}
              onDelete={onDelete}
              onAnalyse={onAnalyse}
              formatFileSize={formatFileSize}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
} 