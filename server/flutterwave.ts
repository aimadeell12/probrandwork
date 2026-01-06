import axios from 'axios';
import crypto from 'crypto';

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

interface DirectCardChargeParams {
  txRef: string;
  amount: string;
  currency: string;
  cardNumber: string;
  cvv: string;
  expiryMonth: string;
  expiryYear: string;
  customer: {
    email: string;
    name: string;
    phonenumber?: string;
  };
  enckey?: string;
  authorization?: {
    mode: string;
    pin?: string;
    otp?: string;
  };
  usesecureauth?: boolean;
  metadata?: Record<string, any>;
}

interface DirectCardChargeResponse {
  status: string;
  message: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    amount: number;
    charged_amount: number;
    currency: string;
    status: string;
    auth_model?: string;
    payment_type: string;
    processor_response?: string;
    narration?: string;
    customer: {
      id: number;
      email: string;
      phone_number: string;
      name: string;
    };
    card?: {
      first_6digits: string;
      last_4digits: string;
      issuer: string;
      country: string;
      type: string;
      expiry: string;
    };
    meta?: {
      authorization: {
        mode: string;
        redirect?: string;
      };
    };
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

  private encrypt3Des(data: string): string {
    if (!this.config.encryptionKey) {
      throw new Error('Encryption key is required for card encryption');
    }

    const encryptionKey = this.config.encryptionKey;
    const cipher = crypto.createCipheriv('des-ede3', encryptionKey, '');
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  async createPaymentLink(params: CreatePaymentLinkParams): Promise<FlutterwavePaymentLinkResponse> {
    if (!this.isConfigured()) {
      throw new Error('Flutterwave is not configured. Please add FLW_SECRET_KEY to environment variables.');
    }

    try {
      // Build a valid redirect URL
      let defaultRedirectUrl = 'http://localhost:5000/payment/verify';
      
      // Use published domain if available, otherwise dev domain
      const domain = process.env.REPLIT_DOMAINS || process.env.REPLIT_DEV_DOMAIN;
      if (domain) {
        // REPLIT_DOMAINS may contain multiple domains separated by commas, use the first one
        const primaryDomain = domain.split(',')[0].trim();
        // Ensure domain has protocol
        const fullDomain = primaryDomain.startsWith('http') ? primaryDomain : `https://${primaryDomain}`;
        defaultRedirectUrl = `${fullDomain}/payment/verify`;
      }
      
      const redirectUrl = params.redirectUrl && params.redirectUrl.trim() !== '' 
        ? params.redirectUrl 
        : defaultRedirectUrl;

      const response = await axios.post<FlutterwavePaymentLinkResponse>(
        `${this.config.baseUrl}/payments`,
        {
          tx_ref: params.txRef,
          amount: params.amount,
          currency: params.currency,
          redirect_url: redirectUrl,
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

  async chargeCard(params: DirectCardChargeParams): Promise<DirectCardChargeResponse> {
    if (!this.isConfigured()) {
      throw new Error('Flutterwave is not configured. Please add FLW_SECRET_KEY to environment variables.');
    }

    if (!this.config.encryptionKey) {
      throw new Error('Flutterwave encryption key is required for card charges.');
    }

    try {
      const payloadData: any = {
        card_number: params.cardNumber,
        cvv: params.cvv,
        expiry_month: params.expiryMonth,
        expiry_year: params.expiryYear,
        currency: params.currency,
        amount: params.amount,
        email: params.customer.email,
        fullname: params.customer.name,
        phone_number: params.customer.phonenumber,
        tx_ref: params.txRef,
      };

      if (params.authorization) {
        payloadData.authorization = params.authorization;
      }

      if (params.usesecureauth !== undefined) {
        payloadData.usesecureauth = params.usesecureauth;
      }

      if (params.metadata) {
        payloadData.meta = params.metadata;
      }

      const encryptedPayload = this.encrypt3Des(JSON.stringify(payloadData));

      const response = await axios.post<DirectCardChargeResponse>(
        `${this.config.baseUrl}/charges?type=card`,
        {
          client: encryptedPayload
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
      console.error('Flutterwave Card Charge Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to charge card');
    }
  }

  async validateCharge(flwRef: string, otp: string): Promise<DirectCardChargeResponse> {
    if (!this.isConfigured()) {
      throw new Error('Flutterwave is not configured.');
    }

    try {
      const response = await axios.post<DirectCardChargeResponse>(
        `${this.config.baseUrl}/validate-charge`,
        {
          otp,
          flw_ref: flwRef,
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
      console.error('Flutterwave Validate Charge Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to validate charge');
    }
  }

  async disablePaymentLink(link: string): Promise<boolean> {
    console.warn('Flutterwave does not provide a direct API to disable payment links. Marking as disabled locally.');
    return true;
  }

  generateTxRef(userId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `FLW-${userId.substring(0, 8)}-${timestamp}-${random}`.toUpperCase();
  }

  getPublicKey(): string {
    return this.config.publicKey;
  }

  getEncryptionKey(): string {
    return this.config.encryptionKey || '';
  }
}

export const flutterwaveService = new FlutterwaveService();
export type { CreatePaymentLinkParams, FlutterwavePaymentLinkResponse, FlutterwaveVerifyResponse, DirectCardChargeParams, DirectCardChargeResponse };
