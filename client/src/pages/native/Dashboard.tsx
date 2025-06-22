import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from '@/components/native';
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  
  const { data: balance } = useQuery({
    queryKey: ['/api/wallet/balance'],
  });

  const { data: transactions } = useQuery({
    queryKey: ['/api/transactions'],
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8fafc',
      padding: 16,
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
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
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
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      marginBottom: 24,
    },
    actionButton: {
      backgroundColor: '#1e40af',
      borderRadius: 12,
      padding: 16,
      flex: 1,
      marginHorizontal: 4,
      alignItems: 'center',
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          {language === 'ar' ? `مرحباً ${user?.firstName}` : `Welcome ${user?.firstName}`}
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

      {transactions?.slice(0, 5).map((transaction: any, index: number) => (
        <View key={index} style={styles.transactionItem}>
          <View>
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

export default Dashboard;