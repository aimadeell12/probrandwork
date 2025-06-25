import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-white overflow-hidden z-[9999]" style={{ minHeight: '100vh', height: '100dvh' }}>
      <div className="h-full flex flex-col max-w-md mx-auto overflow-hidden">
        {/* Fixed Header Area */}
        <div className="flex-shrink-0 bg-white pt-safe-top">
          {/* User Greeting - Fixed */}
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>

          {/* Account/Card Toggle - Fixed */}
          <div className="px-4 mb-2">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          {/* Balance Card - Fixed */}
          <div className="px-4 mb-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="w-6 h-6 rounded" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-6 w-12" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 flex-1 rounded-xl" />
                <Skeleton className="h-10 flex-1 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Quick Actions - Fixed */}
          <div className="px-4 mb-4">
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center">
                  <Skeleton className="w-12 h-12 rounded-xl mx-auto mb-2 bg-gray-200" />
                  <Skeleton className="h-3 w-12 mx-auto bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto native-scroll">
          <div className="px-4 pb-24">
            {/* Recent Transactions Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              
              {/* Transaction Items */}
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
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

            {/* Platform Features */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4">
                  <Skeleton className="w-8 h-8 rounded mb-3" />
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}