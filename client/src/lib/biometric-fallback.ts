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
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #007AFF; margin: 0 auto;">
            <path d="M12 10v4"></path>
            <path d="M12 18h.01"></path>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <path d="M9 9h6v2a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V9z"></path>
          </svg>
        </div>
        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">${options.title}</h3>
        ${options.subtitle ? `<p style="margin: 0 0 16px 0; font-size: 14px; color: #666;">${options.subtitle}</p>` : ''}
        <p style="margin: 0 0 20px 0; font-size: 14px; color: #333;">${options.reason}</p>
        <div style="display: flex; gap: 12px;">
          <button id="biometric-cancel" style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 8px; background: white; font-size: 16px;">إلغاء</button>
          <button id="biometric-auth" style="flex: 1; padding: 12px; border: none; border-radius: 8px; background: #007AFF; color: white; font-size: 16px;">المصادقة</button>
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