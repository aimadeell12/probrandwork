export function AppLoadingSkeleton() {
  return (
    <div 
      className="fixed inset-0 w-screen h-screen flex items-center justify-center relative overflow-hidden z-[9999]"
      style={{ 
        backgroundColor: '#0f0a19',
        minHeight: '100vh', 
        height: '100dvh' 
      }}
    >
      <div className="text-center z-10 px-8 w-full flex flex-col items-center justify-center">
        {/* Logo Section */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <span className="text-white font-bold text-2xl tracking-wide">PRO BRAND<span className="text-purple-400"> WORKS</span></span>
          </div>
        </div>

        {/* Header Text */}
        <div className="mb-12">
          <h1 className="text-gray-400 text-base mb-2 font-light tracking-wide">
            Wallet account
          </h1>
          <h2 className="text-white text-2xl font-bold mb-2 tracking-tight">
            fast <span className="text-purple-400">transfers</span>
          </h2>
        </div>

        {/* Loading Animation - Animated Dots */}
        <div className="relative mb-12 h-16 flex items-center justify-center">
          <div className="flex gap-3">
            <div 
              className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"
              style={{ 
                animationDuration: '1s',
                boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
              }}
            ></div>
            <div 
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg"
              style={{ 
                animationDuration: '1s',
                animationDelay: '0.2s',
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
              }}
            ></div>
            <div 
              className="w-3 h-3 bg-purple-500 rounded-full animate-pulse shadow-lg"
              style={{ 
                animationDuration: '1s',
                animationDelay: '0.4s',
                boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)'
              }}
            ></div>
          </div>
        </div>

        {/* Bottom Indicator Bar */}
        <div className="w-14 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full"></div>
      </div>

      {/* Decorative glow in background */}
      <div 
        className="absolute top-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-full blur-3xl pointer-events-none"
      ></div>
      <div 
        className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-full blur-3xl pointer-events-none"
      ></div>
    </div>
  );
}