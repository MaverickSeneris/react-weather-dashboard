import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for swipe-to-refresh functionality
 * @param {Function} onRefresh - Callback function to execute when refresh is triggered
 * @param {Object} options - Configuration options
 * @returns {Object} - State and refs for the swipe-to-refresh functionality
 */
export function useSwipeToRefresh(onRefresh, options = {}) {
  const {
    threshold = 80, // Distance in pixels to trigger refresh
    resistance = 0.5, // Resistance factor for overscroll
    enabled = true,
  } = options;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const isPulling = useRef(false);
  const isRefreshingRef = useRef(false);
  const containerRef = useRef(null);

  const handleRefresh = useCallback(async () => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    setIsRefreshing(true);
    try {
      await Promise.resolve(onRefresh());
    } finally {
      isRefreshingRef.current = false;
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current || document.documentElement;

    const handleTouchStart = (e) => {
      // Only allow pull-to-refresh when at the top of the page
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      if (scrollTop === 0 && !isRefreshingRef.current) {
        touchStartY.current = e.touches[0].clientY;
        isPulling.current = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling.current || isRefreshingRef.current) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      if (scrollTop > 0) {
        isPulling.current = false;
        setPullDistance(0);
        return;
      }

      const touchY = e.touches[0].clientY;
      const deltaY = touchY - touchStartY.current;

      // Only allow downward pull
      if (deltaY > 0) {
        e.preventDefault();
        const distance = Math.min(deltaY * resistance, threshold * 2);
        setPullDistance(distance);
      } else {
        isPulling.current = false;
        setPullDistance(0);
      }
    };

    const handleTouchEnd = () => {
      if (!isPulling.current || isRefreshingRef.current) {
        isPulling.current = false;
        touchStartY.current = 0;
        return;
      }

      if (pullDistance >= threshold) {
        setPullDistance(0);
        handleRefresh();
      } else {
        // Animate back to top
        setPullDistance(0);
      }

      isPulling.current = false;
      touchStartY.current = 0;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, threshold, resistance, handleRefresh]);

  return {
    isRefreshing,
    pullDistance,
    containerRef,
    threshold,
  };
}

