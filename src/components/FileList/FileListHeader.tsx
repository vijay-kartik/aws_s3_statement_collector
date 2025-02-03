interface FileListHeaderProps {
  isLoading: boolean;
  onRefresh: () => Promise<void>;
}

export function FileListHeader({ isLoading, onRefresh }: FileListHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-800">Uploaded Files</h2>
      <button 
        onClick={onRefresh}
        disabled={isLoading}
        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
        title="Refresh files list"
      >
        <svg 
          className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
      </button>
    </div>
  );
} 