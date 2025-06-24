// Simple response compression middleware
export function compressionMiddleware() {
  return (req: any, res: any, next: any) => {
    const originalSend = res.send;
    
    res.send = function(data: any) {
      // Add compression headers for large responses
      if (typeof data === 'string' && data.length > 1000) {
        res.setHeader('Content-Encoding', 'gzip');
      }
      
      // Add cache headers for API responses
      if (req.path.startsWith('/api/')) {
        if (req.method === 'GET') {
          res.setHeader('Cache-Control', 'public, max-age=30'); // 30 seconds cache
        } else {
          res.setHeader('Cache-Control', 'no-cache');
        }
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };
}