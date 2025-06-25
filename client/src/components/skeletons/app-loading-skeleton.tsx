export function AppLoadingSkeleton() {
  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 flex items-center justify-center relative overflow-hidden z-50">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-lg animate-pulse delay-500"></div>
      
      <div className="text-center z-10 px-8">
        {/* PayDota Logo Animation */}
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-purple-600 dark:text-purple-400">PAY</span>
              <span className="text-gray-800 dark:text-white">dota</span>
            </h1>
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Digital Banking Platform</p>
        </div>

        {/* Beautiful Loading Animation */}
        <div className="relative mb-8">
          {/* Main loading circle */}
          <div className="w-20 h-20 mx-auto relative">
            <div className="absolute inset-0 border-4 border-purple-100 dark:border-purple-900/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 border-r-purple-400 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-2 border-transparent border-t-pink-400 rounded-full animate-spin reverse-spin"></div>
            
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Floating dots around the circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-300"></div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-450"></div>
            </div>
          </div>
        </div>

        {/* Loading text with gradient */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent">
            Getting ready...
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Setting up your secure banking experience</p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
          <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse delay-400"></div>
        </div>
      </div>
    </div>
  );
}