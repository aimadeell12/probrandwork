export function AppLoadingSkeleton() {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-white dark:bg-gray-900 flex items-center justify-center relative overflow-hidden z-[9999]" style={{ minHeight: '100vh', height: '100dvh' }}>
      {/* Simple loading content without decorative elements */}
      
      <div className="text-center z-10 px-8">
        {/* PRO BRAND WORKS Logo Animation */}
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-purple-600 dark:text-purple-400">PRO</span>
              <span className="text-gray-800 dark:text-white">BRANDIFY</span>
            </h1>
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Digital Wallet Platform</p>
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

      </div>
    </div>
  );
}