import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function CreditsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>My Credits & Rewards</Text>
      <Text style={styles.subtitle}>Track your campus involvement and see how you rank.</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>TOTAL BALANCE</Text>
          <Text style={styles.cardIcon}>🏅</Text>
        </View>
        <Text style={styles.balance}>120 <Text style={styles.currency}>CC</Text></Text>
      </View>

      <View style={styles.historyCard}>
        <Text style={styles.historyTitle}>📈 Credit History</Text>
        <Text style={styles.emptyText}>No credit history.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  content: {
    padding: 16,
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#1C2E4A',
    fontWeight: '600',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#8B1A1A', // cc-maroon
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  cardIcon: {
    fontSize: 24,
    opacity: 0.8,
  },
  balance: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  currency: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.8)',
  },
  historyCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C2E4A',
    marginBottom: 16,
  },
  emptyText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
  }
});
