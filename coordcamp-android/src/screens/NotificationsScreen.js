import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function NotificationsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Notifications</Text>
      
      <View style={styles.notificationCard}>
        <Text style={styles.alertType}>[URGENT] assemble</Text>
        <Text style={styles.message}>assemble at auditorium</Text>
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
    marginBottom: 24,
  },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 16,
  },
  alertType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C2E4A',
    marginBottom: 8,
  },
  message: {
    color: '#6B7280',
    fontSize: 15,
  }
});
