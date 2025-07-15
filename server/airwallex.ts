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
  cardholder_id?: string;
  id?: string;
  type: 'INDIVIDUAL' | 'ORGANIZATION';
  email: string;
  mobile_number?: string;
  status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
  individual?: {
    name: {
      first_name: string;
      last_name: string;
      middle_name?: string;
      title?: string;
    };
    date_of_birth: string;
    nationality?: string;
    address?: {
      city: string;
      country: string;
      line1: string;
      line2?: string;
      postcode: string;
      state?: string;
    };
    identification?: {
      country: string;
      document_front_file_id?: string;
      document_back_file_id?: string;
      expiry_date?: string;
      gender?: 'M' | 'F';
      number: string;
      state?: string;
      type: 'DRIVERS_LICENSE' | 'PASSPORT' | 'NATIONAL_ID';
    };
    cardholder_agreement_terms_consent_obtained?: 'yes' | 'no';
    express_consent_obtained?: 'yes' | 'no';
    paperless_notification_consent_obtained?: 'yes' | 'no';
    privacy_policy_terms_consent_obtained?: 'yes' | 'no';
  };
  postal_address?: {
    city: string;
    country: string;
    line1: string;
    line2?: string;
    postcode: string;
    state?: string;
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

    console.log(`🔐 Authenticating with Airwallex... URL: ${this.baseURL}/authentication/login`);
    console.log(`🔑 Client ID: ${this.config.clientId?.substring(0, 10)}...`);
    console.log(`🔑 API Key: ${this.config.apiKey?.substring(0, 10)}...`);
    console.log(`🏢 Mode: ${this.config.isDemo ? 'Demo' : 'Production'}`);

    try {
      const response = await axios.post(`${this.baseURL}/authentication/login`, {}, {
        headers: {
          'x-client-id': this.config.clientId,
          'x-api-key': this.config.apiKey,
          'Content-Type': 'application/json',
        }
      });

      this.accessToken = response.data.token;
      this.tokenExpiresAt = new Date(response.data.expires_at);
      console.log('✅ Airwallex authentication successful');
    } catch (error: any) {
      console.error('❌ Airwallex authentication failed:', error.response?.data || error.message);
      console.error('❌ Full error:', error.response?.status, error.response?.statusText);
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

  async getCardholders(limit: number = 10, offset: number = 0): Promise<AirwallexCardholder[]> {
    const response = await this.request('GET', `/issuing/cardholders?limit=${limit}&offset=${offset}`);
    return response.items || [];
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

  // Account methods
  async getAccountInfo(): Promise<any> {
    return await this.request('GET', '/account');
  }

  async getAccountBalance(): Promise<any> {
    return await this.request('GET', '/balances');
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

// Mock Airwallex Service for local development
class MockAirwallexService {
  private static instance: MockAirwallexService;
  private cardholders: Map<string, AirwallexCardholder> = new Map();
  private cards: Map<string, AirwallexCard> = new Map();
  private transactions: Map<string, AirwallexTransaction> = new Map();

  static getInstance(): MockAirwallexService {
    if (!MockAirwallexService.instance) {
      MockAirwallexService.instance = new MockAirwallexService();
    }
    return MockAirwallexService.instance;
  }

  async createCardholder(cardholderData: Partial<AirwallexCardholder>): Promise<AirwallexCardholder> {
    const id = 'ch_' + Math.random().toString(36).substr(2, 9);
    const cardholder: AirwallexCardholder = {
      cardholder_id: id,
      id,
      type: cardholderData.type || 'INDIVIDUAL',
      email: cardholderData.email || 'user@example.com',
      mobile_number: cardholderData.mobile_number,
      status: 'ACTIVE',
      individual: cardholderData.individual,
      postal_address: cardholderData.postal_address
    };
    
    this.cardholders.set(id, cardholder);
    console.log('✅ Mock Airwallex cardholder created:', id);
    return cardholder;
  }

  async getCardholder(cardholderId: string): Promise<AirwallexCardholder> {
    const cardholder = this.cardholders.get(cardholderId);
    if (!cardholder) {
      throw new Error('Cardholder not found');
    }
    return cardholder;
  }

  async getCardholders(limit: number = 10, offset: number = 0): Promise<AirwallexCardholder[]> {
    const allCardholders = Array.from(this.cardholders.values());
    return allCardholders.slice(offset, offset + limit);
  }

  async createCard(cardData: any): Promise<AirwallexCard> {
    const id = 'card_' + Math.random().toString(36).substr(2, 9);
    const card: AirwallexCard = {
      id,
      cardholder_id: cardData.cardholder_id,
      form_factor: cardData.form_factor || 'VIRTUAL',
      type: cardData.type || 'PREPAID',
      status: 'ACTIVE',
      currency: cardData.currency || 'USD',
      card_number: '4000' + Math.random().toString().substr(2, 12),
      expiry_month: 12,
      expiry_year: 2027,
      cvv: Math.floor(Math.random() * 900 + 100).toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.cards.set(id, card);
    console.log('✅ Mock Airwallex card created:', id);
    return card;
  }

  async getCard(cardId: string): Promise<AirwallexCard> {
    const card = this.cards.get(cardId);
    if (!card) {
      throw new Error('Card not found');
    }
    return card;
  }

  async getCardDetails(cardId: string): Promise<any> {
    const card = this.cards.get(cardId);
    if (!card) {
      console.log(`Available cards: ${Array.from(this.cards.keys()).join(', ')}`);
      throw new Error('Card not found');
    }
    return {
      card_number: card.card_number,
      expiry_month: card.expiry_month,
      expiry_year: card.expiry_year,
      cvv: card.cvv
    };
  }

  async activateCard(cardId: string): Promise<AirwallexCard> {
    const card = this.cards.get(cardId);
    if (!card) {
      throw new Error('Card not found');
    }
    card.status = 'ACTIVE';
    card.updated_at = new Date().toISOString();
    this.cards.set(cardId, card);
    return card;
  }

  async freezeCard(cardId: string): Promise<AirwallexCard> {
    const card = this.cards.get(cardId);
    if (!card) {
      throw new Error('Card not found');
    }
    card.status = 'SUSPENDED';
    card.updated_at = new Date().toISOString();
    this.cards.set(cardId, card);
    return card;
  }

  async unfreezeCard(cardId: string): Promise<AirwallexCard> {
    const card = this.cards.get(cardId);
    if (!card) {
      throw new Error('Card not found');
    }
    card.status = 'ACTIVE';
    card.updated_at = new Date().toISOString();
    this.cards.set(cardId, card);
    return card;
  }

  async cancelCard(cardId: string): Promise<AirwallexCard> {
    const card = this.cards.get(cardId);
    if (!card) {
      throw new Error('Card not found');
    }
    card.status = 'CANCELLED';
    card.updated_at = new Date().toISOString();
    this.cards.set(cardId, card);
    return card;
  }

  async getCardTransactions(cardId: string, options?: any): Promise<{ items: AirwallexTransaction[]; total_count: number }> {
    const cardTransactions = Array.from(this.transactions.values()).filter(t => t.card_id === cardId);
    return {
      items: cardTransactions,
      total_count: cardTransactions.length
    };
  }

  async simulateTransaction(cardId: string, transactionData: any): Promise<AirwallexTransaction> {
    const id = 'txn_' + Math.random().toString(36).substr(2, 9);
    const transaction: AirwallexTransaction = {
      id,
      card_id: cardId,
      amount: transactionData.amount,
      currency: transactionData.currency,
      status: 'AUTHORIZED',
      merchant_name: transactionData.merchant_name,
      merchant_category_code: transactionData.merchant_category_code,
      transaction_type: 'PURCHASE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.transactions.set(id, transaction);
    console.log('✅ Mock Airwallex transaction created:', id);
    return transaction;
  }

  async getAllTransactions(options?: any): Promise<{ items: AirwallexTransaction[]; total_count: number }> {
    const allTransactions = Array.from(this.transactions.values());
    return {
      items: allTransactions,
      total_count: allTransactions.length
    };
  }

  async getCardsByCardholder(cardholderId: string): Promise<AirwallexCard[]> {
    return Array.from(this.cards.values()).filter(card => card.cardholder_id === cardholderId);
  }

  async getAccountInfo(): Promise<any> {
    return {
      id: 'mock_account_' + Math.random().toString(36).substr(2, 9),
      legal_company_name: 'Mock Company Ltd',
      registration_number: 'MOCK123456',
      country: 'US',
      status: 'ACTIVE',
      created_at: '2024-01-01T00:00:00.000Z'
    };
  }

  async getAccountBalance(): Promise<any> {
    return {
      available_balance: [
        { currency: 'USD', amount: 10000.00 },
        { currency: 'EUR', amount: 8500.00 }
      ],
      pending_balance: [
        { currency: 'USD', amount: 0.00 }
      ]
    };
  }
}

// Helper function to initialize Airwallex service
export function createAirwallexService(): AirwallexService | MockAirwallexService {
  const clientId = process.env.AIRWALLEX_CLIENT_ID;
  const apiKey = process.env.AIRWALLEX_API_KEY;

  if (!clientId || !apiKey) {
    console.warn('Airwallex credentials not found. Using mock service.');
    return MockAirwallexService.getInstance();
  }

  console.log('🔄 Initializing Airwallex Production API...');
  try {
    const service = new AirwallexService({
      clientId,
      apiKey,
      isDemo: false
    });
    console.log('✅ Airwallex Production API initialized successfully');
    return service;
  } catch (error: any) {
    console.log('⚠️ Failed to initialize Airwallex Production API:', error.message);
    console.log('⚠️ Falling back to mock service');
    return MockAirwallexService.getInstance();
  }
}