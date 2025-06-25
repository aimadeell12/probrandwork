import { Skeleton } from "@/components/ui/skeleton";

export function NotificationsSkeleton() {
  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 z-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 relative z-10">
        <div className="flex items-center justify-between">
          <Skeleton className="w-6 h-6 rounded" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="w-6 h-6 rounded" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-3 py-4 relative z-10 max-w-sm">
        {/* Filter Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 flex-1 rounded-lg" />
        </div>

        {/* Notification Items */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}