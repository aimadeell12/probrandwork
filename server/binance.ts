import crypto from 'crypto';

interface BinancePayConfig {
  apiKey: string;
  secretKey: string;
  merchantId: string;
  baseUrl: string;
}

interface CreateOrderRequest {
  merchantTradeNo: string;
  totalFee: string;
  currency: string;
  productType: string;
  productName: string;
  productDetail: string;
  returnUrl?: string;
  cancelUrl?: string;
}

interface BinancePayOrder {
  prepayId: string;
  terminalType: string;
  expireTime: number;
  qrcodeLink: string;
  qrContent: string;
  checkoutUrl: string;
  deeplink: string;
  universalUrl: string;
}

export class BinancePayService {
  private config: BinancePayConfig;

  constructor() {
    this.config = {
      apiKey: process.env.BINANCE_API_KEY || '',
      secretKey: process.env.BINANCE_SECRET_KEY || '',
      merchantId: process.env.BINANCE_PAY_MERCHANT_ID || '',
      baseUrl: 'https://bpay.binanceapi.com'
    };
  }

  private generateTimestamp(): number {
    return Date.now();
  }

  private generateNonce(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  private createSignature(timestamp: number, nonce: string, body: string): string {
    const payload = timestamp + '\n' + nonce + '\n' + body + '\n';
    return crypto
      .createHmac('sha512', this.config.secretKey)
      .update(payload)
      .digest('hex')
      .toUpperCase();
  }

  private async makeRequest(endpoint: string, method: string = 'POST', data?: any): Promise<any> {
    if (!this.config.apiKey || !this.config.secretKey || !this.config.merchantId) {
      throw new Error('Binance Pay API credentials are not configured');
    }

    const timestamp = this.generateTimestamp();
    const nonce = this.generateNonce();
    const body = data ? JSON.stringify(data) : '';
    const signature = this.createSignature(timestamp, nonce, body);

    const headers = {
      'Content-Type': 'application/json',
      'BinancePay-Timestamp': timestamp.toString(),
      'BinancePay-Nonce': nonce,
      'BinancePay-Certificate-SN': this.config.apiKey,
      'BinancePay-Signature': signature,
    };

    try {
      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        method,
        headers,
        body: method === 'POST' ? body : undefined,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(`Binance Pay API Error: ${result.errorMessage || 'Unknown error'}`);
      }

      if (result.status !== 'SUCCESS') {
        throw new Error(`Binance Pay Error: ${result.errorMessage || 'Request failed'}`);
      }

      return result.data;
    } catch (error) {
      console.error('Binance Pay API Error:', error);
      throw error;
    }
  }

  async createOrder(orderData: CreateOrderRequest): Promise<BinancePayOrder> {
    const payload = {
      env: {
        terminalType: 'WEB'
      },
      merchantTradeNo: orderData.merchantTradeNo,
      orderAmount: orderData.totalFee,
      currency: orderData.currency,
      goods: {
        goodsType: orderData.productType,
        goodsCategory: 'Z000',
        referenceGoodsId: orderData.merchantTradeNo,
        goodsName: orderData.productName,
        goodsDetail: orderData.productDetail
      },
      shipping: {
        shippingName: {
          firstName: 'User',
          lastName: 'Payment'
        }
      },
      buyer: {
        referenceBuyerId: orderData.merchantTradeNo,
        buyerName: {
          firstName: 'Customer',
          lastName: 'Payment'
        }
      },
      returnUrl: orderData.returnUrl || '',
      cancelUrl: orderData.cancelUrl || ''
    };

    return await this.makeRequest('/binancepay/openapi/v2/order', 'POST', payload);
  }

  async queryOrder(merchantTradeNo: string): Promise<any> {
    const payload = {
      merchantTradeNo
    };

    return await this.makeRequest('/binancepay/openapi/v2/order/query', 'POST', payload);
  }

  async closeOrder(merchantTradeNo: string): Promise<any> {
    const payload = {
      merchantTradeNo
    };

    return await this.makeRequest('/binancepay/openapi/v2/order/close', 'POST', payload);
  }

  // Generate unique merchant trade number
  generateMerchantTradeNo(userId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `DEPOSIT_${userId}_${timestamp}_${random}`;
  }

  // Check if service is configured
  isConfigured(): boolean {
    return !!(this.config.apiKey && this.config.secretKey && this.config.merchantId);
  }
}

export const binancePayService = new BinancePayService();