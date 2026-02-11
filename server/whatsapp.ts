import fetch from 'node-fetch';

interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  verifyToken: string;
  businessAccountId: string;
  baseUrl: string;
}

interface WhatsAppMessage {
  messaging_product: string;
  to: string;
  type: string;
  text?: {
    body: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text: string;
      }>;
    }>;
  };
}

interface SendMessageResponse {
  messaging_product: string;
  contacts: Array<{
    input: string;
    wa_id: string;
  }>;
  messages: Array<{
    id: string;
  }>;
}

export class WhatsAppService {
  private config: WhatsAppConfig;

  constructor() {
    this.config = {
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '637387286132641',
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || 'EAAQrRrLPFnMBOZCjlicG9mv99Sq4iESVFfZBc57wQtZCPGQGnSR14qCw7QNIg7i1Gfhun81GxOQo96M9ILlgr0geX5NrhD19w8BXZCCKHGSxeqzoRaTsAVJwbTrQZCx5EBgVVITAPOxdnqBZBfDUxikrCuwMCNli31nfghrEIuy6qV5ec07ZCWXhFhSUXZAc8JFLZB37BvOOTa1cr6W9uTDY6PkZCeXPmreVKzpD64qhXMZCyUOMO8KH3JkWmkmkDMfKwZDZD',
      verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'brandsoft-pay_webhook_verify_token_2025',
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '576288461869738',
      baseUrl: 'https://graph.facebook.com/v18.0'
    };
    console.log('🔧 WhatsApp Service initialized with config:', {
      phoneNumberId: this.config.phoneNumberId ? 'configured' : 'missing',
      accessToken: this.config.accessToken ? 'configured' : 'missing',
      isConfigured: this.isConfigured()
    });
  }

  // تحقق من إعداد الخدمة
  isConfigured(): boolean {
    return !!(
      this.config.phoneNumberId && 
      this.config.accessToken && 
      this.config.verifyToken
    );
  }

  // إرسال رسالة نصية
  async sendTextMessage(to: string, message: string): Promise<SendMessageResponse> {
    if (!this.isConfigured()) {
      throw new Error('WhatsApp API is not configured. Please provide the required environment variables.');
    }

    // تنسيق رقم الهاتف (إزالة + وإضافة رمز الدولة)
    const formattedPhone = this.formatPhoneNumber(to);

    const messageData: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'text',
      text: {
        body: message
      }
    };

    return await this.sendMessage(messageData);
  }

  // إرسال رمز OTP باستخدام القالب المعتمد
  async sendOTP(to: string, otpCode: string, language: 'ar' | 'en' = 'ar'): Promise<SendMessageResponse> {
    try {
      // محاولة إرسال باستخدام القالب المعتمد أولاً
      return await this.sendOTPTemplate(to, otpCode, language);
    } catch (error) {
      console.log('⚠️ Template OTP failed, falling back to text message:', error);
      // في حالة فشل القالب، استخدم الرسالة النصية
      const messages = {
        ar: `رمز التحقق الخاص بك في BrandSoft Pay هو: ${otpCode}\n\nلا تشارك هذا الرمز مع أي شخص آخر.\nصالح لمدة 5 دقائق.`,
        en: `Your BrandSoft Pay verification code is: ${otpCode}\n\nDo not share this code with anyone.\nValid for 5 minutes.`
      };
      return await this.sendTextMessage(to, messages[language]);
    }
  }

  // إرسال OTP باستخدام القالب المعتمد
  async sendOTPTemplate(to: string, otpCode: string, language: 'ar' | 'en' = 'ar'): Promise<SendMessageResponse> {
    if (!this.isConfigured()) {
      throw new Error('WhatsApp API is not configured. Please provide the required environment variables.');
    }

    const formattedPhone = this.formatPhoneNumber(to);

    // قوالب مختلفة حسب اللغة
    const templateNames = {
      ar: 'otp_verification_ar', // اسم القالب باللغة العربية
      en: 'otp_verification_en'  // اسم القالب باللغة الإنجليزية
    };

    const languageCodes = {
      ar: 'ar',
      en: 'en'
    };

    const messageData: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'template',
      template: {
        name: templateNames[language],
        language: {
          code: languageCodes[language]
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: otpCode
              }
            ]
          }
        ]
      }
    };

    return await this.sendMessage(messageData);
  }

  // إرسال إشعار معاملة
  async sendTransactionNotification(
    to: string, 
    transactionType: 'deposit' | 'withdraw' | 'transfer' | 'payment',
    amount: string,
    currency: string = 'USD',
    language: 'ar' | 'en' = 'ar'
  ): Promise<SendMessageResponse> {
    const transactionTypeNames = {
      ar: {
        deposit: 'إيداع',
        withdraw: 'سحب',
        transfer: 'تحويل',
        payment: 'دفع'
      },
      en: {
        deposit: 'Deposit',
        withdraw: 'Withdrawal',
        transfer: 'Transfer',
        payment: 'Payment'
      }
    };

    const messages = {
      ar: `✅ تم تأكيد عملية ${transactionTypeNames.ar[transactionType]} بمبلغ ${amount} ${currency} في حسابك BrandSoft Pay.\n\nالوقت: ${new Date().toLocaleString('ar-SA')}\n\nشكراً لاستخدام BrandSoft Pay!`,
      en: `✅ Your ${transactionTypeNames.en[transactionType]} of ${amount} ${currency} has been confirmed in your BrandSoft Pay account.\n\nTime: ${new Date().toLocaleString('en-US')}\n\nThank you for using BrandSoft Pay!`
    };

    return await this.sendTextMessage(to, messages[language]);
  }

  // إرسال إشعار أمان
  async sendSecurityAlert(
    to: string,
    alertType: 'login' | 'password_change' | 'suspicious_activity',
    language: 'ar' | 'en' = 'ar'
  ): Promise<SendMessageResponse> {
    const alertMessages = {
      ar: {
        login: '🔐 تم تسجيل دخول جديد إلى حسابك BrandSoft Pay.\n\nإذا لم تكن أنت، يرجى تغيير كلمة المرور فوراً.',
        password_change: '🔑 تم تغيير كلمة مرور حسابك BrandSoft Pay بنجاح.\n\nإذا لم تقم بهذا التغيير، يرجى الاتصال بالدعم فوراً.',
        suspicious_activity: '⚠️ تم اكتشاف نشاط مشبوه في حسابك BrandSoft Pay.\n\nيرجى مراجعة حسابك وتغيير كلمة المرور إذا لزم الأمر.'
      },
      en: {
        login: '🔐 New login detected on your BrandSoft Pay account.\n\nIf this wasn\'t you, please change your password immediately.',
        password_change: '🔑 Your BrandSoft Pay account password has been successfully changed.\n\nIf you didn\'t make this change, please contact support immediately.',
        suspicious_activity: '⚠️ Suspicious activity detected on your BrandSoft Pay account.\n\nPlease review your account and change your password if necessary.'
      }
    };

    return await this.sendTextMessage(to, alertMessages[language][alertType]);
  }

  // إرسال إشعار بطاقة جديدة
  async sendCardNotification(
    to: string,
    cardType: 'virtual' | 'physical',
    cardLast4: string,
    language: 'ar' | 'en' = 'ar'
  ): Promise<SendMessageResponse> {
    const cardTypeNames = {
      ar: { virtual: 'افتراضية', physical: 'فيزيائية' },
      en: { virtual: 'Virtual', physical: 'Physical' }
    };

    const messages = {
      ar: `💳 تم إنشاء بطاقة ${cardTypeNames.ar[cardType]} جديدة بنجاح!\n\nآخر 4 أرقام: ${cardLast4}\n\nيمكنك الآن استخدام بطاقتك للمدفوعات.`,
      en: `💳 New ${cardTypeNames.en[cardType]} card created successfully!\n\nLast 4 digits: ${cardLast4}\n\nYou can now use your card for payments.`
    };

    return await this.sendTextMessage(to, messages[language]);
  }

  // تنسيق رقم الهاتف
  private formatPhoneNumber(phoneNumber: string): string {
    // إزالة الرموز والمسافات
    let formatted = phoneNumber.replace(/[\s\-\(\)\+]/g, '');
    
    // إضافة رمز الدولة إذا لم يكن موجوداً
    if (!formatted.startsWith('212') && !formatted.startsWith('966') && !formatted.startsWith('971')) {
      // افتراض المغرب كرمز افتراضي
      if (formatted.startsWith('0')) {
        formatted = '212' + formatted.substring(1);
      } else {
        formatted = '212' + formatted;
      }
    }

    return formatted;
  }

  // إرسال الرسالة
  private async sendMessage(messageData: WhatsAppMessage): Promise<SendMessageResponse> {
    const url = `${this.config.baseUrl}/${this.config.phoneNumberId}/messages`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('WhatsApp API Error:', errorText);
        throw new Error(`WhatsApp API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json() as SendMessageResponse;
      console.log('✅ WhatsApp message sent successfully:', result.messages[0]?.id);
      return result;

    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  // التحقق من webhook
  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === 'subscribe' && token === this.config.verifyToken) {
      console.log('WhatsApp webhook verified successfully');
      return challenge;
    }
    return null;
  }

  // معالجة webhook الواردة
  async handleWebhook(body: any): Promise<void> {
    try {
      if (body.object === 'whatsapp_business_account') {
        if (body.entry && body.entry[0]?.changes && body.entry[0].changes[0]?.value?.messages) {
          const messages = body.entry[0].changes[0].value.messages;
          
          for (const message of messages) {
            console.log('📱 Received WhatsApp message:', {
              from: message.from,
              type: message.type,
              timestamp: message.timestamp
            });

            // يمكن إضافة منطق معالجة الرسائل الواردة هنا
            // مثل الرد التلقائي أو توجيه الرسائل للدعم
          }
        }

        // معالجة حالات التسليم
        if (body.entry && body.entry[0]?.changes && body.entry[0].changes[0]?.value?.statuses) {
          const statuses = body.entry[0].changes[0].value.statuses;
          
          for (const status of statuses) {
            console.log('📊 WhatsApp message status:', {
              id: status.id,
              status: status.status,
              timestamp: status.timestamp
            });
          }
        }
      }
    } catch (error) {
      console.error('Error handling WhatsApp webhook:', error);
    }
  }
}

export const whatsappService = new WhatsAppService();