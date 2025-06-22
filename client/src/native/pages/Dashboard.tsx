import React from 'react';
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";
import { useQuery } from "@tanstack/react-query";

// مكونات React Native البسيطة للويب
const View = ({ children, style, ...props }: any) => (
  <div style={style} {...props}>{children}</div>
);

const Text = ({ children, style, ...props }: any) => (
  <span style={style} {...props}>{children}</span>
);

const ScrollView = ({ children, style, ...props }: any) => (
  <div style={{ overflow: 'auto', ...style }} {...props}>{children}</div>
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

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface Balance {
  balance?: number;
}

interface Transaction {
  id: string;
  merchant_name?: string;
  amount: number;
  created: number;
}

const NativeDashboard = () => {
  const { user } = useAuth() as { user: User };
  const { language } = useLanguage();
  
  const { data: balance } = useQuery({
    queryKey: ['/api/wallet/balance'],
  }) as { data: Balance };

  const { data: transactions } = useQuery({
    queryKey: ['/api/transactions'],
  }) as { data: Transaction[] };

  const styles = {
    container: {
      flex: 1,
      backgroundColor: '#f8fafc',
      padding: 16,
      minHeight: '100vh',
    },
    header: {
      marginBottom: 24,
    },
    welcomeText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#1e40af',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: '#64748b',
    },
    balanceCard: {
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    balanceLabel: {
      fontSize: 14,
      color: '#64748b',
      marginBottom: 8,
    },
    balanceAmount: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#1e40af',
    },
    quickActions: {
      display: 'flex',
      flexDirection: 'row' as const,
      justifyContent: 'space-between',
      marginBottom: 24,
      gap: 8,
    },
    actionButton: {
      backgroundColor: '#1e40af',
      borderRadius: 12,
      padding: 16,
      flex: 1,
      alignItems: 'center',
      textAlign: 'center' as const,
    },
    actionText: {
      color: '#ffffff',
      fontWeight: '600',
      marginTop: 8,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: 16,
    },
    transactionItem: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      display: 'flex',
      flexDirection: 'row' as const,
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
    },
    transactionInfo: {
      display: 'flex',
      flexDirection: 'column' as const,
    },
    transactionName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1e293b',
    },
    transactionDate: {
      fontSize: 14,
      color: '#64748b',
      marginTop: 4,
    },
    transactionAmount: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#059669',
    },
  };

  const getTransactionsList = () => {
    if (!transactions || !Array.isArray(transactions)) return [];
    return transactions.slice(0, 5);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          {language === 'ar' ? `مرحباً ${user?.firstName || 'المستخدم'}` : `Welcome ${user?.firstName || 'User'}`}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'ar' ? 'نظرة عامة على حسابك المصرفي' : 'Your banking overview'}
        </Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>
          {language === 'ar' ? 'الرصيد الحالي' : 'Current Balance'}
        </Text>
        <Text style={styles.balanceAmount}>
          ${balance?.balance?.toLocaleString() || '0'}
        </Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>
            {language === 'ar' ? 'إرسال' : 'Send'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>
            {language === 'ar' ? 'إيداع' : 'Deposit'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>
            {language === 'ar' ? 'البطاقات' : 'Cards'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>
        {language === 'ar' ? 'آخر المعاملات' : 'Recent Transactions'}
      </Text>

      {getTransactionsList().map((transaction: Transaction, index: number) => (
        <View key={transaction.id || index} style={styles.transactionItem}>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionName}>
              {transaction.merchant_name || 'Unknown Merchant'}
            </Text>
            <Text style={styles.transactionDate}>
              {new Date(transaction.created * 1000).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.transactionAmount}>
            -${(transaction.amount / 100).toFixed(2)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default NativeDashboard;