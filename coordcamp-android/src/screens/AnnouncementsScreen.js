import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';

export default function AnnouncementsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Announcements</Text>
      <Text style={styles.subtitle}>Broadcast messages to your club members.</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Message Title</Text>
        <TextInput style={styles.input} placeholder="e.g. Room Change for Tonight" placeholderTextColor="#9CA3AF" />

        <Text style={styles.label}>Message Body</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Type your announcement here..." 
          placeholderTextColor="#9CA3AF" 
          multiline 
          numberOfLines={4}
        />

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Mark as Urgent</Text>
          <View style={styles.toggleBox}><Text style={{color: '#8B1A1A'}}>Off</Text></View>
        </View>

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Send Announcement</Text>
        </TouchableOpacity>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C2E4A',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1C2E4A',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C2E4A',
  },
  toggleBox: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  submitButton: {
    backgroundColor: '#8B1A1A',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
