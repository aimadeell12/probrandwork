import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 z-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 relative z-10">
        <div className="flex items-center justify-between">
          <Skeleton className="w-6 h-6 rounded" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="w-16 h-8 rounded-lg" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 relative z-10 max-w-sm">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-32 mx-auto mb-2" />
          <Skeleton className="h-4 w-40 mx-auto" />
        </div>

        {/* Profile Form */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <Skeleton className="h-5 w-32 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <Skeleton className="h-5 w-36 mb-4" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>

          {/* Address Information */}
          <div>
            <Skeleton className="h-5 w-28 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 flex-1 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}