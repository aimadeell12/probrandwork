import React, { useState } from 'react';
import { useLanguage } from "../../hooks/useLanguage";

// مكونات React Native البسيطة للويب
const View = ({ children, style, ...props }: any) => (
  <div style={style} {...props}>{children}</div>
);

const Text = ({ children, style, ...props }: any) => (
  <span style={style} {...props}>{children}</span>
);

const TextInput = ({ style, placeholder, value, onChangeText, secureTextEntry, ...props }: any) => (
  <input
    type={secureTextEntry ? 'password' : 'text'}
    style={{ 
      outline: 'none', 
      border: 'none', 
      background: 'transparent', 
      width: '100%',
      ...style 
    }}
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChangeText?.(e.target.value)}
    {...props}
  />
);

const TouchableOpacity = ({ children, style, onPress, ...props }: any) => (
  <div 
    style={{ cursor: 'pointer', ...style }} 
    onClick={onPress} 
    {...props}
  >
    {children}
  </div>
);

const NativeLogin = () => {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const styles = {
    container: {
      flex: 1,
      backgroundColor: '#f8fafc',
      padding: 20,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoSection: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logo: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#1e40af',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: '#64748b',
      textAlign: 'center' as const,
    },
    formContainer: {
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 32,
      width: '100%',
      maxWidth: 400,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1e293b',
      textAlign: 'center' as const,
      marginBottom: 24,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      color: '#374151',
      marginBottom: 8,
      fontWeight: '500',
    },
    input: {
      backgroundColor: '#f9fafb',
      borderRadius: 8,
      padding: 12,
      border: '1px solid #e5e7eb',
      fontSize: 16,
    },
    loginButton: {
      backgroundColor: '#1e40af',
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      marginTop: 16,
      width: '100%',
    },
    loginButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center' as const,
    },
    forgotPassword: {
      textAlign: 'center' as const,
      marginTop: 16,
    },
    forgotPasswordText: {
      color: '#1e40af',
      fontSize: 14,
    },
    registerSection: {
      textAlign: 'center' as const,
      marginTop: 24,
      padding: 16,
    },
    registerText: {
      color: '#64748b',
      fontSize: 14,
    },
    registerLink: {
      color: '#1e40af',
      fontSize: 14,
      fontWeight: '600',
    },
  };

  const handleLogin = () => {
    // تنفيذ تسجيل الدخول
    window.location.href = '/login';
  };

  const handleRegister = () => {
    // تنفيذ التسجيل
    window.location.href = '/register';
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoSection}>
        <Text style={styles.logo}>PayDota</Text>
        <Text style={styles.subtitle}>
          {language === 'ar' ? 'منصة الخدمات المصرفية الرقمية' : 'Digital Banking Platform'}
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>
          {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
          </Text>
          <View style={styles.input}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            {language === 'ar' ? 'كلمة المرور' : 'Password'}
          </Text>
          <View style={styles.input}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>
            {language === 'ar' ? 'دخول' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>
            {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.registerSection}>
        <Text style={styles.registerText}>
          {language === 'ar' ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
        </Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerLink}>
            {language === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NativeLogin;