import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AttendanceScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Attendance Reports</Text>
      <Text style={styles.subtitle}>Review check-ins and member participation.</Text>
      
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.cardTitle}>Recent Events</Text>
        </View>
        
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.eventTitle}>Welcome Week Kickoff</Text>
            <Text style={styles.eventDate}>2026-09-01</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>Attended</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#FEE2E2' }]}>
            <Text style={[styles.statValue, { color: '#DC2626' }]}>85%</Text>
            <Text style={styles.statLabel}>Rate</Text>
          </View>
        </View>

        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.eventTitle}>Weekly Meeting</Text>
            <Text style={styles.eventDate}>2026-09-08</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>38</Text>
            <Text style={styles.statLabel}>Attended</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#FEE2E2' }]}>
            <Text style={[styles.statValue, { color: '#DC2626' }]}>72%</Text>
            <Text style={styles.statLabel}>Rate</Text>
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
    color: '#8B1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 24,
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
  header: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C2E4A',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1C2E4A',
    marginBottom: 4,
  },
  eventDate: {
    color: '#6B7280',
    fontSize: 14,
  },
  statBox: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 60,
    marginLeft: 12,
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1C2E4A',
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: 'bold',
  }
});
