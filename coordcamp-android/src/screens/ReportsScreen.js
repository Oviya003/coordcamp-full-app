import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ReportsScreen() {
  const reports = [
    { id: 1, type: 'System Error', desc: 'Login timeout issue', status: 'Resolved' },
    { id: 2, type: 'User Flag', desc: 'Inappropriate event description', status: 'Pending' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>System Reports</Text>
      <Text style={styles.subtitle}>Review system issues and user flags.</Text>
      
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.cardTitle}>Recent Reports</Text>
        </View>

        {reports.map((report, index) => (
          <View key={report.id} style={[styles.row, index === reports.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.reportType}>{report.type}</Text>
              <Text style={styles.reportDesc}>{report.desc}</Text>
            </View>
            <View style={[styles.statusBox, report.status === 'Resolved' ? styles.resolvedBox : styles.pendingBox]}>
              <Text style={[styles.statusText, report.status === 'Resolved' ? styles.resolvedText : styles.pendingText]}>{report.status}</Text>
            </View>
          </View>
        ))}

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
  reportType: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1C2E4A',
    marginBottom: 4,
  },
  reportDesc: {
    color: '#6B7280',
    fontSize: 14,
  },
  statusBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  resolvedBox: {
    backgroundColor: '#DCFCE7',
  },
  resolvedText: {
    color: '#15803D',
  },
  pendingBox: {
    backgroundColor: '#FEF9C3',
  },
  pendingText: {
    color: '#A16207',
  }
});
