interface PullToRefreshIndicatorProps {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
  threshold: number;
}

export default function PullToRefreshIndicator({
  isPulling,
  pullDistance,
  isRefreshing,
  threshold
}: PullToRefreshIndicatorProps) {
  if (!isPulling) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 flex justify-center items-center transition-transform z-50"
      style={{ 
        transform: `translateY(${Math.min(pullDistance / 2, threshold)}px)`,
        opacity: Math.min(pullDistance / threshold, 1)
      }}
    >
      <div className="flex items-center gap-2 text-primary text-sm bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
        {isRefreshing ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
                fill="none"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Refreshing...</span>
          </>
        ) : (
          <>
            <svg 
              className={`transform transition-transform ${pullDistance > threshold ? 'rotate-180' : ''}`} 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 5 5 12" />
            </svg>
            <span>{pullDistance > threshold ? 'Release to refresh' : 'Pull to refresh'}</span>
          </>
        )}
      </div>
    </div>
  );
} 