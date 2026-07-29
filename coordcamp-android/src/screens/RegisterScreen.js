import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, ScrollView, SafeAreaView } from 'react-native';
import { supabase } from '../config/supabase';

export default function RegisterScreen({ route, navigation }) {
  const { role } = route.params || { role: 'student' };
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const roleConfig = {
    student: { title: 'Student Registration', btnColor: '#8B1A1A' }, // maroon
    leader: { title: 'Club Leader Registration', btnColor: '#D4AF37' }, // gold
    admin: { title: 'University Admin Registration', btnColor: '#10B981' } // green
  };
  
  const currentConfig = roleConfig[role] || roleConfig.student;
  
  const dbRoleMap = {
    'student': 'student',
    'leader': 'clubLeader',
    'admin': 'admin'
  };
  
  const targetRole = dbRoleMap[role] || 'student';

  const handleRegister = async () => {
    if (!name || !email || !studentId || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      // 1. Sign up user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            student_id: studentId,
            role: targetRole,
          }
        }
      });

      if (signUpError) throw signUpError;
      
      // 2. Wait for profile trigger to potentially fire, or patch it manually like web
      // React Native Supabase auth handles session storage automatically
      // We will attempt to update the profile directly if the trigger failed
      
      if (data?.user) {
        await supabase
          .from('profiles')
          .update({ role: targetRole, full_name: name })
          .eq('id', data.user.id);
      }

      Alert.alert('Success', 'Account created successfully!');
      
    } catch (err) {
      Alert.alert('Registration Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          
          <Text style={[styles.title, { color: currentConfig.btnColor }]}>{currentConfig.title}</Text>
          <Text style={styles.subtitle}>Join the university portal</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>👤</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>✉️</Text>
            <TextInput
              style={styles.input}
              placeholder="University Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>#️⃣</Text>
            <TextInput
              style={styles.input}
              placeholder="Student ID"
              placeholderTextColor="#9CA3AF"
              value={studentId}
              onChangeText={setStudentId}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={{ fontSize: 18, color: '#9CA3AF' }}>
                {showPassword ? '👁️' : '🚫'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: currentConfig.btnColor }]} 
            onPress={handleRegister} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.buttonText, role === 'leader' && { color: '#1C2E4A' }]}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text 
              style={styles.footerLink}
              onPress={() => navigation.navigate('Login', { role })}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6', // cc-offwhite
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    paddingVertical: 48,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 400,
    padding: 32,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 24,
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    fontSize: 18,
    color: '#9CA3AF',
  },
  input: {
    width: '100%',
    height: 60,
    backgroundColor: '#FAF9F6',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 16,
    paddingLeft: 48,
    paddingRight: 48,
    fontSize: 16,
    fontWeight: '600',
    color: '#1C2E4A',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
    justifyContent: 'center',
    height: '100%',
  },
  button: {
    width: '100%',
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#4B5563',
    fontWeight: '600',
  },
  footerLink: {
    color: '#D4AF37', // cc-gold
    fontWeight: 'bold',
  }
});
