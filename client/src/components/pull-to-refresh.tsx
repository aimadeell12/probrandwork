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
    const distance = Math.max(0, (currentY - startY.current) * 0.3);
    
    if (distance > 0 && distance < 100) {
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
      {/* مؤشر التحديث الثابت في الأعلى مع مراعاة شريط الحالة */}
      {isRefreshing && (
        <div 
          className="fixed left-0 right-0 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200"
          style={{ 
            top: 'env(safe-area-inset-top, 0px)',
            paddingTop: 'env(safe-area-inset-top, 0px)'
          }}
        >
          <RefreshCw className="h-4 w-4 text-purple-600 animate-spin" />
        </div>
      )}

      {/* المحتوى الرئيسي */}
      <div
        ref={containerRef}
        className="h-full overflow-auto native-scroll"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          paddingTop: isRefreshing ? 'calc(32px + env(safe-area-inset-top, 0px))' : 'env(safe-area-inset-top, 0px)',
          transition: 'padding-top 0.3s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
}