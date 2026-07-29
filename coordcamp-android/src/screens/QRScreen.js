import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../config/supabase';

export default function QRScreen() {
  const [status, setStatus] = useState('idle'); // idle | checking | success | error

  // This is a mock function since we can't test the physical camera in the emulator easily
  const handleMockScan = async () => {
    setStatus('checking');
    
    // Simulate network request
    setTimeout(() => {
      setStatus('success');
      Alert.alert('Success', 'Successfully checked in!');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Check-in</Text>
      
      <View style={styles.card}>
        <Text style={styles.message}>
          {status === 'checking' 
            ? 'Verifying attendance...' 
            : status === 'success'
              ? 'Checked In!'
              : 'Position the QR code within the frame to check in.'}
        </Text>

        <View style={styles.cameraBox}>
          {status === 'success' ? (
            <Text style={styles.successIcon}>✅</Text>
          ) : (
            <View style={styles.scannerFrame}>
              <Text style={styles.cameraText}>[ CAMERA VIEW ]</Text>
              {status === 'checking' && <Text style={styles.loadingText}>Scanning...</Text>}
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={styles.mockButton} 
          onPress={handleMockScan}
          disabled={status === 'checking'}
        >
          <Text style={styles.mockButtonText}>Simulate Scan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6', // cc-offwhite
    padding: 16,
    paddingTop: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B1A1A', // cc-maroon
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C2E4A',
    marginBottom: 24,
    textAlign: 'center',
  },
  cameraBox: {
    width: 250,
    height: 250,
    backgroundColor: '#000',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFBEB', // cc-cream
    marginBottom: 24,
  },
  scannerFrame: {
    width: '80%',
    height: '80%',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraText: {
    color: '#FFFFFF',
    opacity: 0.5,
  },
  loadingText: {
    color: '#FEF9C3', // cc-gold light
    marginTop: 12,
    fontWeight: 'bold',
  },
  successIcon: {
    fontSize: 64,
  },
  mockButton: {
    backgroundColor: '#1C2E4A', // cc-navy
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  mockButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
