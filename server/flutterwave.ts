import axios from 'axios';

interface FlutterwaveConfig {
  secretKey: string;
  publicKey: string;
  encryptionKey?: string;
  baseUrl: string;
}

interface CreatePaymentLinkParams {
  txRef: string;
  amount: string;
  currency: string;
  redirectUrl?: string;
  paymentOptions?: string;
  customer: {
    email: string;
    name?: string;
    phonenumber?: string;
  };
  customizations?: {
    title: string;
    description?: string;
    logo?: string;
  };
  metadata?: Record<string, any>;
}

interface FlutterwavePaymentLinkResponse {
  status: string;
  message: string;
  data: {
    link: string;
  };
}

interface FlutterwaveVerifyResponse {
  status: string;
  message: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    amount: number;
    currency: string;
    charged_amount: number;
    status: string;
    payment_type: string;
    customer: {
      email: string;
      name: string;
      phone_number?: string;
    };
    card?: {
      first_6digits: string;
      last_4digits: string;
      issuer: string;
      country: string;
      type: string;
      expiry: string;
    };
    created_at: string;
  };
}

class FlutterwaveService {
  private config: FlutterwaveConfig;

  constructor() {
    this.config = {
      secretKey: process.env.FLW_SECRET_KEY || '',
      publicKey: process.env.FLW_PUBLIC_KEY || '',
      encryptionKey: process.env.FLW_ENCRYPTION_KEY || '',
      baseUrl: 'https://api.flutterwave.com/v3',
    };

    if (!this.config.secretKey) {
      console.warn('⚠️  Flutterwave Secret Key not configured. Payment link creation will fail.');
    } else {
      console.log('✅ Flutterwave Service initialized');
    }
  }

  isConfigured(): boolean {
    return !!this.config.secretKey;
  }

  async createPaymentLink(params: CreatePaymentLinkParams): Promise<FlutterwavePaymentLinkResponse> {
    if (!this.isConfigured()) {
      throw new Error('Flutterwave is not configured. Please add FLW_SECRET_KEY to environment variables.');
    }

    try {
      const response = await axios.post<FlutterwavePaymentLinkResponse>(
        `${this.config.baseUrl}/payments`,
        {
          tx_ref: params.txRef,
          amount: params.amount,
          currency: params.currency,
          redirect_url: params.redirectUrl || `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/payment/verify`,
          payment_options: params.paymentOptions || 'card',
          customer: params.customer,
          customizations: params.customizations,
          meta: params.metadata,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Flutterwave API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create payment link');
    }
  }

  async verifyTransaction(transactionId: string): Promise<FlutterwaveVerifyResponse> {
    if (!this.isConfigured()) {
      throw new Error('Flutterwave is not configured. Please add FLW_SECRET_KEY to environment variables.');
    }

    try {
      const response = await axios.get<FlutterwaveVerifyResponse>(
        `${this.config.baseUrl}/transactions/${transactionId}/verify`,
        {
          headers: {
            Authorization: `Bearer ${this.config.secretKey}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Flutterwave Verification Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to verify transaction');
    }
  }

  async disablePaymentLink(link: string): Promise<boolean> {
    if (!this.isConfigured()) {
      throw new Error('Flutterwave is not configured. Please add FLW_SECRET_KEY to environment variables.');
    }

    try {
      const response = await axios.post(
        `${this.config.baseUrl}/payments/link/disable`,
        { link },
        {
          headers: {
            Authorization: `Bearer ${this.config.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.status === 'success';
    } catch (error: any) {
      console.error('Flutterwave Disable Link Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to disable payment link');
    }
  }

  generateTxRef(userId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `FLW-${userId.substring(0, 8)}-${timestamp}-${random}`.toUpperCase();
  }
}

export const flutterwaveService = new FlutterwaveService();
export type { CreatePaymentLinkParams, FlutterwavePaymentLinkResponse, FlutterwaveVerifyResponse };
