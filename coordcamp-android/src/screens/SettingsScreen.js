import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Manage your account preferences and profile details.</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Profile Details</Text>
        
        <Text style={styles.label}>Full Name</Text>
        <TextInput 
          style={styles.input}
          value="Anna"
          editable={false}
        />
        
        <Text style={styles.label}>Email Address</Text>
        <TextInput 
          style={styles.input}
          value="oviya.p03@gmail.com"
          editable={false}
        />
        
        <Text style={styles.label}>Bio</Text>
        <TextInput 
          style={[styles.input, styles.textArea]}
          placeholder="Tell us about your interests..."
          multiline
        />
        
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
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
    color: '#6B7280',
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C2E4A',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1C2E4A',
    marginBottom: 20,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#1C2E4A',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    alignSelf: 'flex-end',
    minWidth: 120,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
