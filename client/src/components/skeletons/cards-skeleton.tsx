import { Skeleton } from "@/components/ui/skeleton";

export function CardsSkeleton() {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 overflow-hidden z-[9999]" style={{ minHeight: '100vh', height: '100dvh' }}>
      <div className="h-full flex flex-col max-w-md mx-auto">
        {/* Fixed Header Area */}
        <div className="flex-shrink-0 bg-white border-b border-gray-100 pt-safe-top">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between px-4 py-4">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>

          {/* Card Type Toggle - Fixed */}
          <div className="px-4 pb-4">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <Skeleton className="h-10 flex-1 rounded-lg" />
              <Skeleton className="h-10 flex-1 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Scrollable Cards Area */}
        <div className="flex-1 overflow-y-auto native-scroll">
          <div className="px-4 py-6 pb-24">
            {/* Card Items */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative">
                  {/* Card Skeleton */}
                  <div className="w-full aspect-[1.6/1] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 relative overflow-hidden">
                    {/* Card Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4">
                        <Skeleton className="w-12 h-8 rounded" />
                      </div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-6 w-32" />
                      </div>
                      
                      <div>
                        <Skeleton className="h-5 w-40 mb-2" />
                        <div className="flex justify-between items-end">
                          <div>
                            <Skeleton className="h-3 w-16 mb-1" />
                            <Skeleton className="h-4 w-12" />
                          </div>
                          <Skeleton className="w-8 h-6 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-4 flex gap-3">
                    <Skeleton className="h-9 flex-1 rounded-lg" />
                    <Skeleton className="h-9 flex-1 rounded-lg" />
                    <Skeleton className="h-9 w-16 rounded-lg" />
                  </div>

                  {/* Recent Transactions */}
                  <div className="mt-4 bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    
                    {[1, 2].map((j) => (
                      <div key={j} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-8 h-8 rounded-full" />
                          <div>
                            <Skeleton className="h-3 w-20 mb-1" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-12" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}