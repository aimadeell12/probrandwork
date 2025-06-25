import { useState, useRef, useCallback, ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { useNativeInteractions } from '@/hooks/useNativeInteractions';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  refreshingText?: string;
  pullText?: string;
  releaseText?: string;
}

export default function PullToRefresh({
  children,
  onRefresh,
  threshold = 60,
  refreshingText = "",
  pullText = "Pull to refresh",
  releaseText = "Release to refresh"
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const { triggerHaptic } = useNativeInteractions();

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, (currentY - startY.current) * 0.5);
    
    if (distance > 0) {
      e.preventDefault();
      setPullDistance(distance);
      
      // إضافة ردود فعل لمسية عند الوصول للحد الأدنى
      if (distance >= threshold && pullDistance < threshold) {
        triggerHaptic({ type: 'medium' });
      }
    }
  }, [isPulling, isRefreshing, threshold, pullDistance, triggerHaptic]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;

    setIsPulling(false);
    
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      triggerHaptic({ type: 'heavy' });
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh, triggerHaptic]);

  const getRefreshText = () => {
    if (isRefreshing) return refreshingText;
    if (pullDistance >= threshold) return releaseText;
    return pullText;
  };

  const refreshOpacity = Math.min(pullDistance / threshold, 1);
  const iconRotation = isRefreshing ? 'animate-spin' : '';

  return (
    <div className="relative h-full">
      {/* مؤشر التحديث المخفي في الأعلى */}
      <div 
        className="absolute top-0 left-0 right-0 flex items-center justify-center bg-white z-50 border-b border-gray-100"
        style={{ 
          height: `${Math.min(pullDistance, 50)}px`,
          opacity: refreshOpacity,
          transform: `translateY(-${Math.max(0, 50 - pullDistance)}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
        }}
      >
        <div className="flex items-center gap-2 py-2">
          <RefreshCw 
            className={`h-5 w-5 text-purple-600 ${iconRotation}`}
            style={{
              transform: isRefreshing ? 'none' : `rotate(${pullDistance * 3}deg)`
            }}
          />
          {pullDistance > 20 && (
            <span className="text-sm text-purple-600 font-medium">
              {getRefreshText()}
            </span>
          )}
        </div>
      </div>

      {/* المحتوى الرئيسي - لا يختفي أبداً */}
      <div
        ref={containerRef}
        className="h-full overflow-auto native-scroll"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          transform: `translateY(${pullDistance > 0 ? Math.min(pullDistance * 0.3, 15) : 0}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
}