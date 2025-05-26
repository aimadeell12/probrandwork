import fetch from 'node-fetch';

interface ReapCardResponse {
  id: string;
  card_number: string;
  exp_month: number;
  exp_year: number;
  cvv: string;
  status: string;
  balance: number;
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
  cardholder_name: string;
  card_type: 'virtual' | 'physical';
  spending_limit?: number;
}

class ReapService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.REAP_API_KEY || '';
    this.baseUrl = 'https://api.reap.com'; // استخدم URL الصحيح من Documentation
    
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
      },
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`Reap API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Reap API request failed:', error);
      throw error;
    }
  }

  async createCard(cardData: ReapCreateCardRequest): Promise<ReapCardResponse> {
    if (!this.apiKey) {
      // محاكاة إنشاء البطاقة عند عدم وجود API key
      return {
        id: `reap_${Date.now()}`,
        card_number: this.generateCardNumber(),
        exp_month: 12,
        exp_year: new Date().getFullYear() + 3,
        cvv: Math.floor(Math.random() * 900 + 100).toString(),
        status: 'active',
        balance: 0
      };
    }

    return await this.makeRequest('/cards', 'POST', cardData);
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

  async getCardTransactions(cardId: string): Promise<ReapTransactionResponse[]> {
    if (!this.apiKey) {
      return [];
    }

    return await this.makeRequest(`/cards/${cardId}/transactions`);
  }

  async addFunds(cardId: string, amount: number): Promise<{ success: boolean; new_balance: number }> {
    if (!this.apiKey) {
      return { success: true, new_balance: amount };
    }

    return await this.makeRequest(`/cards/${cardId}/fund`, 'POST', { amount });
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