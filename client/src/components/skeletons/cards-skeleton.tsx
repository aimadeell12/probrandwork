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
          {/* Loading cards skeleton */}
          <div className="space-y-6">
            {/* Multiple card skeletons that look like actual cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative">
                {/* Card Skeleton - Made to look like real cards */}
                <div className="w-full aspect-[1.6/1] bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-6 relative overflow-hidden shadow-lg">
                  {/* Card brand logo area */}
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-8 bg-white bg-opacity-20 rounded animate-pulse"></div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="h-4 w-20 bg-white bg-opacity-30 rounded mb-2 animate-pulse"></div>
                      <div className="h-6 w-32 bg-white bg-opacity-30 rounded animate-pulse"></div>
                    </div>
                    
                    <div>
                      {/* Card number area */}
                      <div className="h-5 w-40 bg-white bg-opacity-30 rounded mb-3 animate-pulse"></div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="h-3 w-16 bg-white bg-opacity-20 rounded mb-1 animate-pulse"></div>
                          <div className="h-4 w-12 bg-white bg-opacity-20 rounded animate-pulse"></div>
                        </div>
                        <div className="w-8 h-6 bg-white bg-opacity-20 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Loading indicator with text */}
          <div className="flex flex-col items-center justify-center py-8 mt-6">
            <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-purple-600 rounded-full mb-3"></div>
            <p className="text-gray-500 text-sm">Loading your cards...</p>
          </div>
        </div>
      </div>
    </div>
  );
}