import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AnalyticsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Campus Analytics</Text>
      <Text style={styles.subtitle}>University-wide engagement metrics.</Text>
      
      <View style={styles.kpiContainer}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>TOTAL ACTIVE STUDENTS</Text>
          <Text style={styles.kpiValue}>12,450</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>TOTAL CLUBS</Text>
          <Text style={styles.kpiValue}>142</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>EVENTS THIS MONTH</Text>
          <Text style={styles.kpiValue}>85</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>AVG ATTENDANCE</Text>
          <Text style={styles.kpiValue}>64%</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Top Performing Clubs</Text>
        <View style={styles.barChartPlaceholder}>
          <View style={styles.barRow}>
            <Text style={styles.barLabel}>Robotics</Text>
            <View style={[styles.bar, { width: '80%' }]}></View>
          </View>
          <View style={styles.barRow}>
            <Text style={styles.barLabel}>Music</Text>
            <View style={[styles.bar, { width: '65%' }]}></View>
          </View>
          <View style={styles.barRow}>
            <Text style={styles.barLabel}>Chess</Text>
            <View style={[styles.bar, { width: '40%' }]}></View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 32,
    paddingBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 24,
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  kpiCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C2E4A',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C2E4A',
    marginBottom: 16,
  },
  barChartPlaceholder: {
    marginTop: 8,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  barLabel: {
    width: 60,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  bar: {
    height: 16,
    backgroundColor: '#10B981',
    borderRadius: 8,
  }
});
