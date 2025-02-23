import { useState, useCallback, useEffect } from 'react';

interface UsePullToRefreshProps {
  onRefresh: () => Promise<void>;
  threshold?: number;
}

export function usePullToRefresh({ onRefresh, threshold = 80 }: UsePullToRefreshProps) {
  const [pullStartY, setPullStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Reset pull state when refresh completes
  const resetPullState = useCallback(() => {
    setPullDistance(0);
    setIsPulling(false);
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
      resetPullState();
    }
  }, [onRefresh, resetPullState]);

  // Touch handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop === 0) {
      setPullStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling) return;

    const y = e.touches[0].clientY;
    const distance = Math.max(0, y - pullStartY);
    setPullDistance(distance);

    // Prevent default scrolling while pulling
    if (distance > 0) {
      e.preventDefault();
    }
  }, [isPulling, pullStartY]);

  const handleTouchEnd = useCallback(() => {
    if (!isPulling) return;

    if (pullDistance > threshold) {
      handleRefresh();
    } else {
      resetPullState();
    }
  }, [isPulling, pullDistance, threshold, handleRefresh, resetPullState]);

  // Add and remove event listeners
  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isPulling,
    pullDistance,
    isRefreshing,
    threshold
  };
} 