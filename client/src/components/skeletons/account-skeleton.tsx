import { Skeleton } from "@/components/ui/skeleton";

export function AccountSkeleton() {
  return (
    <div className="app-page bg-white w-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 relative z-10">
        <div className="flex items-center justify-center">
          <Skeleton className="h-6 w-32" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-3 py-4 relative z-10 max-w-sm">
        
        {/* User Profile Card */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 text-white mb-4 shadow-lg border-0 rounded-2xl overflow-hidden">
          <div className="p-4">
            <div className="w-full flex items-center space-x-3 rounded-lg p-1">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="w-6 h-6 rounded" />
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {/* First Group */}
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between px-4 py-4 border-b border-gray-200 last:border-0">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-6 h-6 rounded" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="w-5 h-5 rounded" />
              </div>
            ))}
          </div>

          {/* Second Group */}
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between px-4 py-4 border-b border-gray-200 last:border-0">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-6 h-6 rounded" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="w-5 h-5 rounded" />
              </div>
            ))}
          </div>

          {/* Third Group */}
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between px-4 py-4 border-b border-gray-200 last:border-0">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-6 h-6 rounded" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="w-5 h-5 rounded" />
              </div>
            ))}
          </div>

          {/* Language Toggle */}
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-6 h-6 rounded" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="w-12 h-6 rounded-full" />
            </div>
          </div>

          {/* Admin Panel (conditional) */}
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-6 h-6 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="w-5 h-5 rounded" />
            </div>
          </div>

          {/* Logout Button */}
          <div className="pt-4">
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}