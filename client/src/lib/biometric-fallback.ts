// Biometric authentication fallback for Capacitor
// This simulates biometric authentication when native plugins aren't available

import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';

export interface BiometricResult {
  isAuthenticated: boolean;
  error?: string;
}

export class BiometricFallback {
  static async checkAvailability(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return false;
    }

    try {
      const deviceInfo = await Device.getInfo();
      // Simulate biometric availability check
      return deviceInfo.platform === 'android' || deviceInfo.platform === 'ios';
    } catch (error) {
      return false;
    }
  }

  static async authenticate(options: {
    reason: string;
    title: string;
    subtitle?: string;
  }): Promise<BiometricResult> {
    if (!Capacitor.isNativePlatform()) {
      return { isAuthenticated: false, error: 'Not a native platform' };
    }

    try {
      // In a real implementation, this would call native biometric APIs
      // For now, we'll simulate the authentication process
      
      // Show a simulated biometric prompt
      const result = await this.simulateBiometricPrompt(options);
      
      return { isAuthenticated: result };
    } catch (error) {
      return { 
        isAuthenticated: false, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      };
    }
  }

  private static async simulateBiometricPrompt(options: {
    reason: string;
    title: string;
    subtitle?: string;
  }): Promise<boolean> {
    return new Promise((resolve) => {
      // Create a modal-like interface to simulate biometric authentication
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      `;

      const content = document.createElement('div');
      content.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 24px;
        max-width: 320px;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      `;

      content.innerHTML = `
        <div style="margin-bottom: 16px;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #007AFF; margin: 0 auto; display: block;">
            <circle cx="9" cy="7" r="4"></circle>
            <path d="m3 21 7-7 7 7"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            <path d="M21 3.13a8 8 0 0 1 0 13.75"></path>
          </svg>
        </div>
        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; text-align: center;">${options.title}</h3>
        ${options.subtitle ? `<p style="margin: 0 0 16px 0; font-size: 14px; color: #666; text-align: center;">${options.subtitle}</p>` : ''}
        <p style="margin: 0 0 20px 0; font-size: 14px; color: #333; text-align: center;">${options.reason}</p>
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="width: 60px; height: 60px; border: 3px solid #007AFF; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; animation: pulse 2s infinite;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="color: #007AFF;">
              <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.69-2.5 1.68-3.4 2.96-.08.14-.23.21-.39.21z"/>
            </svg>
          </div>
        </div>
        <div style="display: flex; gap: 12px;">
          <button id="biometric-cancel" style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 8px; background: white; font-size: 16px; cursor: pointer;">إلغاء</button>
          <button id="biometric-auth" style="flex: 1; padding: 12px; border: none; border-radius: 8px; background: #007AFF; color: white; font-size: 16px; cursor: pointer;">تأكيد المصادقة</button>
        </div>
      `;

      modal.appendChild(content);
      document.body.appendChild(modal);

      const cancelBtn = content.querySelector('#biometric-cancel') as HTMLButtonElement;
      const authBtn = content.querySelector('#biometric-auth') as HTMLButtonElement;

      const cleanup = () => {
        document.body.removeChild(modal);
      };

      cancelBtn.addEventListener('click', () => {
        cleanup();
        resolve(false);
      });

      authBtn.addEventListener('click', () => {
        cleanup();
        resolve(true);
      });

      // Auto-close after 30 seconds
      setTimeout(() => {
        if (document.body.contains(modal)) {
          cleanup();
          resolve(false);
        }
      }, 30000);
    });
  }
}