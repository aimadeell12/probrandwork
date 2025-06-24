import memoize from 'memoizee';

// Simple memory cache with TTL
class SimpleCache {
  private cache = new Map<string, { data: any; expires: number }>();

  set(key: string, data: any, ttlMs: number = 60000) {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttlMs
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  invalidate(pattern?: string) {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
  }
}

export const cache = new SimpleCache();

// Memoized functions for expensive operations
export const memoizedStripeOperations = {
  // Cache Stripe card list for 2 minutes
  getCards: memoize(async (stripe: any, customerId: string) => {
    console.log(`🔄 Fetching fresh Stripe cards for customer: ${customerId}`);
    const cards = await stripe.issuing.cards.list({
      cardholder: customerId,
      limit: 50,
    });
    return cards.data;
  }, { 
    maxAge: 2 * 60 * 1000, // 2 minutes
    primitive: true 
  }),

  // Cache Stripe transactions for 1 minute
  getTransactions: memoize(async (stripe: any, cardId: string) => {
    console.log(`🔄 Fetching fresh Stripe transactions for card: ${cardId}`);
    const transactions = await stripe.issuing.transactions.list({
      card: cardId,
      limit: 10,
    });
    return transactions.data;
  }, { 
    maxAge: 60 * 1000, // 1 minute
    primitive: true 
  }),

  // Cache cardholder details for 5 minutes
  getCardholder: memoize(async (stripe: any, cardholderId: string) => {
    console.log(`🔄 Fetching fresh Stripe cardholder: ${cardholderId}`);
    return await stripe.issuing.cardholders.retrieve(cardholderId);
  }, { 
    maxAge: 5 * 60 * 1000, // 5 minutes
    primitive: true 
  })
};

// Cache keys
export const CACHE_KEYS = {
  USER_BALANCE: (userId: string) => `balance:${userId}`,
  USER_CARDS: (userId: string) => `cards:${userId}`,
  USER_TRANSACTIONS: (userId: string) => `transactions:${userId}`,
  KYC_STATUS: (userId: string) => `kyc:${userId}`,
  NOTIFICATIONS: (userId: string) => `notifications:${userId}`,
} as const;