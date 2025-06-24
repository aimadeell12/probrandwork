// Development utility to simulate network conditions
export const networkSimulator = {
  _isOfflineSimulated: false,
  
  // Simulate offline mode (for development/testing)
  simulateOffline: () => {
    networkSimulator._isOfflineSimulated = true;
    console.log('📵 Network offline simulation enabled');
  },
  
  // Restore online mode
  simulateOnline: () => {
    networkSimulator._isOfflineSimulated = false;
    console.log('📶 Network online simulation enabled');
  },
  
  // Check if offline simulation is active
  isSimulatingOffline: () => networkSimulator._isOfflineSimulated,
  
  // Override network status for testing
  getSimulatedStatus: () => ({
    connected: !networkSimulator._isOfflineSimulated,
    connectionType: networkSimulator._isOfflineSimulated ? 'none' : 'wifi'
  })
};

// Make it available globally for testing
if (typeof window !== 'undefined') {
  (window as any).networkSimulator = networkSimulator;
}