import crypto from 'crypto';
import { WhatsAppService } from './whatsapp';

interface OTPRecord {
  code: string;
  phone: string;
  email?: string;
  purpose: 'login' | 'registration' | 'password_reset' | 'phone_verification' | 'transaction';
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
  isUsed: boolean;
  createdAt: Date;
}

export class OTPService {
  private otpStore: Map<string, OTPRecord> = new Map();
  private readonly OTP_LENGTH = 6;
  private readonly OTP_EXPIRY_MINUTES = 5;
  private readonly MAX_ATTEMPTS = 3;
  private readonly CLEANUP_INTERVAL = 60000; // 1 minute
  private whatsappService: WhatsAppService;

  constructor() {
    this.whatsappService = new WhatsAppService();
    // تنظيف الـ OTP المنتهية الصلاحية كل دقيقة
    setInterval(() => {
      this.cleanupExpiredOTPs();
    }, this.CLEANUP_INTERVAL);
  }

  // إنشاء رمز OTP جديد
  generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  // إنشاء مفتاح فريد للـ OTP
  private generateOTPKey(phone: string, purpose: string): string {
    return `${phone}_${purpose}`;
  }

  // إرسال OTP عبر WhatsApp
  async sendOTP(
    phone: string,
    purpose: 'login' | 'registration' | 'password_reset' | 'phone_verification' | 'transaction',
    email?: string,
    language: 'ar' | 'en' = 'ar'
  ): Promise<{ success: boolean; message: string; expiresIn: number }> {
    try {
      const otpKey = this.generateOTPKey(phone, purpose);
      const code = this.generateOTP();
      const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

      // حفظ OTP في الذاكرة
      const otpRecord: OTPRecord = {
        code,
        phone,
        email,
        purpose,
        expiresAt,
        attempts: 0,
        maxAttempts: this.MAX_ATTEMPTS,
        isUsed: false,
        createdAt: new Date()
      };

      this.otpStore.set(otpKey, otpRecord);

      // إرسال OTP عبر WhatsApp (الإنتاج الحقيقي)
      try {
        if (this.whatsappService.isConfigured()) {
          await this.whatsappService.sendOTP(phone, code, language);
          
          console.log(`📱 OTP sent via WhatsApp to ${phone} for ${purpose}`);
          return {
            success: true,
            message: language === 'ar' ? 'تم إرسال رمز التحقق عبر WhatsApp' : 'OTP sent via WhatsApp',
            expiresIn: this.OTP_EXPIRY_MINUTES * 60
          };
        } else {
          // إذا لم يكن WhatsApp مُعداً، أرجع خطأ في الإنتاج
          console.error('❌ WhatsApp service not configured in production');
          return {
            success: false,
            message: language === 'ar' ? 'خدمة WhatsApp غير مُعدة بشكل صحيح' : 'WhatsApp service is not configured',
            expiresIn: 0
          };
        }
      } catch (whatsappError) {
        console.error('❌ Failed to send WhatsApp OTP:', whatsappError);
        return {
          success: false,
          message: language === 'ar' ? 'فشل في إرسال رمز التحقق عبر WhatsApp' : 'Failed to send OTP via WhatsApp',
          expiresIn: 0
        };
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: language === 'ar' ? 'خطأ في إرسال رمز التحقق' : 'Error sending OTP',
        expiresIn: 0
      };
    }
  }

  // التحقق من OTP
  verifyOTP(
    phone: string,
    code: string,
    purpose: 'login' | 'registration' | 'password_reset' | 'phone_verification' | 'transaction'
  ): { success: boolean; message: string; attemptsLeft?: number } {
    const otpKey = this.generateOTPKey(phone, purpose);
    const otpRecord = this.otpStore.get(otpKey);

    if (!otpRecord) {
      return {
        success: false,
        message: 'OTP not found or expired'
      };
    }

    // التحقق من انتهاء الصلاحية
    if (new Date() > otpRecord.expiresAt) {
      this.otpStore.delete(otpKey);
      return {
        success: false,
        message: 'OTP has expired'
      };
    }

    // التحقق من الاستخدام المسبق
    if (otpRecord.isUsed) {
      return {
        success: false,
        message: 'OTP has already been used'
      };
    }

    // التحقق من عدد المحاولات
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      this.otpStore.delete(otpKey);
      return {
        success: false,
        message: 'Maximum attempts exceeded'
      };
    }

    // زيادة عدد المحاولات
    otpRecord.attempts++;

    // التحقق من الرمز
    if (otpRecord.code !== code) {
      this.otpStore.set(otpKey, otpRecord);
      const attemptsLeft = otpRecord.maxAttempts - otpRecord.attempts;
      
      if (attemptsLeft <= 0) {
        this.otpStore.delete(otpKey);
        return {
          success: false,
          message: 'Invalid OTP. Maximum attempts exceeded.'
        };
      }

      return {
        success: false,
        message: 'Invalid OTP',
        attemptsLeft
      };
    }

    // تسجيل الرمز كمستخدم
    otpRecord.isUsed = true;
    this.otpStore.set(otpKey, otpRecord);

    console.log(`✅ OTP verified successfully for ${phone} (${purpose})`);
    return {
      success: true,
      message: 'OTP verified successfully'
    };
  }

  // التحقق من وجود OTP نشط
  hasActiveOTP(phone: string, purpose: string): boolean {
    const otpKey = this.generateOTPKey(phone, purpose);
    const otpRecord = this.otpStore.get(otpKey);

    if (!otpRecord) return false;
    if (otpRecord.isUsed) return false;
    if (new Date() > otpRecord.expiresAt) {
      this.otpStore.delete(otpKey);
      return false;
    }
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      this.otpStore.delete(otpKey);
      return false;
    }

    return true;
  }

  // الحصول على وقت انتهاء OTP
  getOTPExpiryTime(phone: string, purpose: string): Date | null {
    const otpKey = this.generateOTPKey(phone, purpose);
    const otpRecord = this.otpStore.get(otpKey);

    if (!otpRecord || otpRecord.isUsed || new Date() > otpRecord.expiresAt) {
      return null;
    }

    return otpRecord.expiresAt;
  }

  // إلغاء OTP
  cancelOTP(phone: string, purpose: string): boolean {
    const otpKey = this.generateOTPKey(phone, purpose);
    return this.otpStore.delete(otpKey);
  }

  // تنظيف الـ OTP المنتهية الصلاحية
  private cleanupExpiredOTPs(): void {
    const now = new Date();
    let cleanedCount = 0;

    const entries = Array.from(this.otpStore.entries());
    for (const [key, record] of entries) {
      if (now > record.expiresAt || record.isUsed) {
        this.otpStore.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} expired OTP records`);
    }
  }

  // إحصائيات OTP
  getStats(): {
    totalActive: number;
    byPurpose: Record<string, number>;
    oldestOTP: Date | null;
  } {
    const stats = {
      totalActive: 0,
      byPurpose: {} as Record<string, number>,
      oldestOTP: null as Date | null
    };

    const now = new Date();
    const records = Array.from(this.otpStore.values());

    for (const record of records) {
      if (!record.isUsed && now <= record.expiresAt && record.attempts < record.maxAttempts) {
        stats.totalActive++;
        stats.byPurpose[record.purpose] = (stats.byPurpose[record.purpose] || 0) + 1;
        
        if (!stats.oldestOTP || record.createdAt < stats.oldestOTP) {
          stats.oldestOTP = record.createdAt;
        }
      }
    }

    return stats;
  }
}

export const otpService = new OTPService();