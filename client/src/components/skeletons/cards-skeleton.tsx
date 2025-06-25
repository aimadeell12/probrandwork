import { Skeleton } from "@/components/ui/skeleton";

export function CardsSkeleton() {
  return (
    <div className="h-screen h-[100dvh] bg-white w-full overflow-hidden">
      <div className="h-full flex flex-col max-w-md mx-auto">
        {/* Fixed Header Area */}
        <div className="flex-shrink-0 bg-white border-b border-gray-100" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}>
          {/* Header - Fixed */}
          <div className="flex items-center justify-between px-4 py-4 pt-2 pb-2 mb-4">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>

          {/* Card Type Toggle - Fixed */}
          <div className="px-4 pb-4">
            <div className="bg-gray-200 rounded-full p-1 flex">
              <Skeleton className="h-10 flex-1 rounded-full" />
              <Skeleton className="h-10 flex-1 rounded-full" />
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 pb-24">
          {/* Show skeleton for empty state (similar to actual "No cards yet" screen) */}
          <div className="flex flex-col items-center justify-center text-center py-12">
            {/* Purple circle with card icon skeleton */}
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Skeleton className="w-10 h-10 rounded" />
            </div>
            
            {/* Text skeletons */}
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-4 w-48 mb-6" />
            
            {/* Button skeleton */}
            <Skeleton className="h-10 w-40 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}