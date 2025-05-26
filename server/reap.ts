import fetch from 'node-fetch';

interface ReapCardResponse {
  id: string;
}

interface ReapTransactionResponse {
  id: string;
  amount: number;
  currency: string;
  description: string;
  status: string;
  merchant_name: string;
  created_at: string;
}

interface ReapCreateCardRequest {
  cardType: 'Physical' | 'Virtual';
  customerType: 'Consumer';
  kyc: {
    firstName: string;
    lastName: string;
    dob: string;
    residentialAddress: {
      line1: string;
      line2?: string;
      city: string;
      country: string;
    };
    idDocumentType: string;
    idDocumentNumber: string;
  };
  preferredCardName: string;
  meta: {
    otpPhoneNumber: {
      dialCode: string;
      phoneNumber: string;
    };
    id: string;
    email: string;
  };
}

class ReapService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.REAP_API_KEY || '';
    this.baseUrl = 'https://api.reap.global/api/v1';
    
    if (!this.apiKey) {
      console.warn('Reap API key not found. Card operations will be simulated.');
    }
  }

  private async makeRequest(endpoint: string, method: string = 'GET', data?: any) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const options: any = {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    try {
      console.log('🔑 Making Reap API request:', {
        url,
        method,
        headers: options.headers,
        body: data ? JSON.stringify(data, null, 2) : undefined
      });

      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Reap API error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Reap API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Reap API success:', result);
      return result;
    } catch (error) {
      console.error('Reap API request failed:', error);
      throw error;
    }
  }

  async createCard(cardData: ReapCreateCardRequest): Promise<ReapCardResponse> {
    console.log('📋 Data being sent to Reap API:', JSON.stringify(cardData, null, 2));
    return await this.makeRequest('/cards', 'POST', cardData) as ReapCardResponse;
  }

  async getCard(cardId: string): Promise<ReapCardResponse> {
    if (!this.apiKey) {
      throw new Error('Reap API key required');
    }

    return await this.makeRequest(`/cards/${cardId}`);
  }

  async updateCardStatus(cardId: string, status: 'active' | 'suspended' | 'cancelled'): Promise<ReapCardResponse> {
    if (!this.apiKey) {
      throw new Error('Reap API key required');
    }

    return await this.makeRequest(`/cards/${cardId}`, 'PATCH', { status });
  }

  async freezeCard(cardId: string): Promise<ReapCardResponse> {
    if (!this.apiKey) {
      throw new Error('Reap API key required');
    }

    return await this.makeRequest(`/cards/${cardId}/status`, 'PUT', { freeze: true });
  }

  async unfreezeCard(cardId: string): Promise<ReapCardResponse> {
    if (!this.apiKey) {
      throw new Error('Reap API key required');
    }

    return await this.makeRequest(`/cards/${cardId}/status`, 'PUT', { freeze: false });
  }

  async getCardTransactions(cardId: string): Promise<ReapTransactionResponse[]> {
    if (!this.apiKey) {
      return [];
    }

    return await this.makeRequest(`/cards/${cardId}/transactions`);
  }

  async addFunds(cardId: string, amount: number): Promise<{ creditBefore: string; creditAfter: string }> {
    const response = await this.makeRequest(`/cards/${cardId}/credit`, 'PUT', { adjustment: amount.toString() });
    return response as { creditBefore: string; creditAfter: string };
  }

  async getCardBalance(cardId: string): Promise<number> {
    if (!this.apiKey) {
      return 0;
    }

    const card = await this.getCard(cardId);
    return card.balance;
  }

  private generateCardNumber(): string {
    // توليد رقم بطاقة وهمي للاختبار
    const prefix = '4532'; // Visa prefix
    let cardNumber = prefix;
    
    for (let i = 0; i < 12; i++) {
      cardNumber += Math.floor(Math.random() * 10);
    }
    
    return cardNumber;
  }

  // دالة لاختبار الاتصال بـ API
  async testConnection(): Promise<boolean> {
    if (!this.apiKey) {
      console.log('No Reap API key provided - running in simulation mode');
      return false;
    }

    try {
      await this.makeRequest('/ping'); // أو أي endpoint للاختبار
      console.log('Reap API connection successful');
      return true;
    } catch (error) {
      console.error('Reap API connection failed:', error);
      return false;
    }
  }
}

export const reapService = new ReapService();