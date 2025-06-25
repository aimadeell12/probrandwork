import { Skeleton } from "@/components/ui/skeleton";

export function AppLoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        {/* PayDota Logo Skeleton */}
        <div className="w-16 h-16 mx-auto mb-6">
          <Skeleton className="w-full h-full rounded-2xl" />
        </div>
        
        {/* Loading Text */}
        <Skeleton className="h-6 w-32 mx-auto" />
        
        {/* Loading Spinner */}
        <div className="flex justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-purple-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}