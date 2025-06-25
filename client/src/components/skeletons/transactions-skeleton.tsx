import { Skeleton } from "@/components/ui/skeleton";

export function TransactionsSkeleton() {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 overflow-hidden z-[9999]" style={{ minHeight: '100vh', height: '100dvh' }}>
      <div className="h-full flex flex-col max-w-md mx-auto">
        {/* Fixed Header Area */}
        <div className="flex-shrink-0 bg-white border-b border-gray-100 pt-safe-top">
          {/* Header - Fixed */}
          <div className="px-4 py-4">
            <Skeleton className="h-7 w-32 mx-auto" />
          </div>

          {/* Search Bar - Fixed */}
          <div className="px-4 mb-4">
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>

          {/* Filter Buttons - Fixed */}
          <div className="px-4 pb-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Transactions Area */}
        <div className="flex-1 overflow-y-auto native-scroll">
          <div className="px-4 py-4 pb-24">
            {/* Transaction Groups */}
            <div className="space-y-6">
              {/* Today */}
              <div>
                <Skeleton className="h-4 w-16 mb-3" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between py-3 bg-gray-50 rounded-xl px-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Yesterday */}
              <div>
                <Skeleton className="h-4 w-20 mb-3" />
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between py-3 bg-gray-50 rounded-xl px-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-28 mb-1" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* This Week */}
              <div>
                <Skeleton className="h-4 w-24 mb-3" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between py-3 bg-gray-50 rounded-xl px-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-18" />
                        </div>
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}