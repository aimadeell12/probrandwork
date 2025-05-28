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
  refreshingText = "Refreshing...",
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
    <div
      ref={containerRef}
      className="relative overflow-hidden native-scroll"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ 
        transform: `translateY(${pullDistance > 0 ? Math.min(pullDistance, threshold * 1.2) : 0}px)`,
        transition: isPulling ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      {/* مؤشر السحب للتحديث */}
      <div 
        className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center text-center bg-gradient-to-b from-purple-50 to-transparent dark:from-purple-900/50 z-10"
        style={{ 
          height: `${Math.min(pullDistance, threshold * 1.2)}px`,
          opacity: refreshOpacity,
          transform: `translateY(-${Math.max(0, threshold * 1.2 - pullDistance)}px)`
        }}
      >
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
          <RefreshCw className={`h-5 w-5 ${iconRotation}`} />
          <span className="text-sm font-medium">{getRefreshText()}</span>
        </div>
        
        {/* شريط التقدم */}
        <div className="w-16 h-1 bg-purple-200 dark:bg-purple-700 rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full bg-purple-600 dark:bg-purple-400 transition-all duration-150"
            style={{ width: `${Math.min(100, (pullDistance / threshold) * 100)}%` }}
          />
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}