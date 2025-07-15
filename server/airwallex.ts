import axios from 'axios';

// Airwallex API Configuration
const AIRWALLEX_API_URL = 'https://api.airwallex.com/api/v1';
const DEMO_API_URL = 'https://pci-api-demo.airwallex.com/api/v1';

export interface AirwallexConfig {
  clientId: string;
  apiKey: string;
  isDemo?: boolean;
}

export interface AirwallexCardholder {
  id: string;
  type: 'INDIVIDUAL' | 'ORGANIZATION';
  individual?: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    date_of_birth?: string;
  };
  organization?: {
    legal_name: string;
    business_registration_number?: string;
    email: string;
  };
}

export interface AirwallexCard {
  id: string;
  cardholder_id: string;
  form_factor: 'VIRTUAL' | 'PHYSICAL';
  type: 'PREPAID' | 'DEBIT' | 'GOOD_FUNDS_CREDIT';
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'SUSPENDED';
  currency: string;
  card_number?: string;
  expiry_month?: number;
  expiry_year?: number;
  cvv?: string;
  spending_limits?: {
    single_transaction_limit?: number;
    daily_limit?: number;
    monthly_limit?: number;
  };
  created_at: string;
  updated_at: string;
}

export interface AirwallexTransaction {
  id: string;
  card_id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'DECLINED' | 'FAILED';
  merchant_name?: string;
  merchant_category_code?: string;
  transaction_type: 'PURCHASE' | 'REFUND' | 'WITHDRAWAL' | 'ADJUSTMENT';
  created_at: string;
  updated_at: string;
}

export class AirwallexService {
  private config: AirwallexConfig;
  private accessToken: string | null = null;
  private tokenExpiresAt: Date | null = null;

  constructor(config: AirwallexConfig) {
    this.config = config;
  }

  private get baseURL(): string {
    return this.config.isDemo ? DEMO_API_URL : AIRWALLEX_API_URL;
  }

  private async authenticate(): Promise<void> {
    if (this.accessToken && this.tokenExpiresAt && new Date() < this.tokenExpiresAt) {
      return; // Token is still valid
    }

    try {
      const response = await axios.post(`${this.baseURL}/authentication/login`, {
        x_client_id: this.config.clientId,
        x_api_key: this.config.apiKey,
      });

      this.accessToken = response.data.token;
      this.tokenExpiresAt = new Date(response.data.expires_at);
    } catch (error) {
      console.error('Airwallex authentication failed:', error);
      throw new Error('Failed to authenticate with Airwallex API');
    }
  }

  private async request(method: string, endpoint: string, data?: any): Promise<any> {
    await this.authenticate();

    const config = {
      method,
      url: `${this.baseURL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'x-api-version': '2024-03-31',
      },
      data,
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error: any) {
      console.error('Airwallex API request failed:', error.response?.data || error.message);
      throw error;
    }
  }

  // Cardholder methods
  async createCardholder(cardholderData: Partial<AirwallexCardholder>): Promise<AirwallexCardholder> {
    return await this.request('POST', '/issuing/cardholders', cardholderData);
  }

  async getCardholder(cardholderId: string): Promise<AirwallexCardholder> {
    return await this.request('GET', `/issuing/cardholders/${cardholderId}`);
  }

  // Card methods
  async createCard(cardData: {
    cardholder_id: string;
    form_factor: 'VIRTUAL' | 'PHYSICAL';
    type: 'PREPAID' | 'DEBIT' | 'GOOD_FUNDS_CREDIT';
    currency?: string;
    purpose?: string;
    spending_limits?: {
      single_transaction_limit?: number;
      daily_limit?: number;
      monthly_limit?: number;
    };
    postal_address?: {
      line1: string;
      city: string;
      state: string;
      postcode: string;
      country_code: string;
    };
    primary_contact_details?: {
      first_name: string;
      last_name: string;
      email: string;
    };
  }): Promise<AirwallexCard> {
    return await this.request('POST', '/issuing/cards', cardData);
  }

  async getCard(cardId: string): Promise<AirwallexCard> {
    return await this.request('GET', `/issuing/cards/${cardId}`);
  }

  async getCardDetails(cardId: string): Promise<AirwallexCard> {
    return await this.request('GET', `/issuing/cards/${cardId}/details`);
  }

  async updateCard(cardId: string, updateData: Partial<AirwallexCard>): Promise<AirwallexCard> {
    return await this.request('PUT', `/issuing/cards/${cardId}`, updateData);
  }

  async activateCard(cardId: string): Promise<AirwallexCard> {
    return await this.request('POST', `/issuing/cards/${cardId}/activate`);
  }

  async freezeCard(cardId: string): Promise<AirwallexCard> {
    return await this.request('POST', `/issuing/cards/${cardId}/freeze`);
  }

  async unfreezeCard(cardId: string): Promise<AirwallexCard> {
    return await this.request('POST', `/issuing/cards/${cardId}/unfreeze`);
  }

  async cancelCard(cardId: string): Promise<AirwallexCard> {
    return await this.request('POST', `/issuing/cards/${cardId}/cancel`);
  }

  // Transaction methods
  async getCardTransactions(cardId: string, options?: {
    from_created_date?: string;
    to_created_date?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: AirwallexTransaction[]; total_count: number }> {
    const params = new URLSearchParams();
    params.append('card_id', cardId);
    
    if (options?.from_created_date) params.append('from_created_date', options.from_created_date);
    if (options?.to_created_date) params.append('to_created_date', options.to_created_date);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());

    return await this.request('GET', `/issuing/transactions?${params.toString()}`);
  }

  async getTransaction(transactionId: string): Promise<AirwallexTransaction> {
    return await this.request('GET', `/issuing/transactions/${transactionId}`);
  }

  // Simulation methods for testing
  async simulateTransaction(cardId: string, transactionData: {
    amount: number;
    currency: string;
    merchant_category_code?: string;
    merchant_name?: string;
  }): Promise<AirwallexTransaction> {
    return await this.request('POST', '/issuing/simulate/authorize', {
      card_id: cardId,
      ...transactionData,
    });
  }

  // Utility methods
  async getCardsByCardholder(cardholderId: string): Promise<AirwallexCard[]> {
    const response = await this.request('GET', `/issuing/cards?cardholder_id=${cardholderId}`);
    return response.items || [];
  }

  async getAllTransactions(options?: {
    from_created_date?: string;
    to_created_date?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: AirwallexTransaction[]; total_count: number }> {
    const params = new URLSearchParams();
    
    if (options?.from_created_date) params.append('from_created_date', options.from_created_date);
    if (options?.to_created_date) params.append('to_created_date', options.to_created_date);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());

    return await this.request('GET', `/issuing/transactions?${params.toString()}`);
  }
}

// Helper function to initialize Airwallex service
export function createAirwallexService(): AirwallexService {
  const clientId = process.env.AIRWALLEX_CLIENT_ID;
  const apiKey = process.env.AIRWALLEX_API_KEY;
  const isDemo = process.env.NODE_ENV !== 'production';

  if (!clientId || !apiKey) {
    console.warn('Airwallex credentials not found. Card operations will be simulated.');
    // Return a mock service for development
    return new AirwallexService({
      clientId: 'demo_client_id',
      apiKey: 'demo_api_key',
      isDemo: true,
    });
  }

  return new AirwallexService({
    clientId,
    apiKey,
    isDemo,
  });
}