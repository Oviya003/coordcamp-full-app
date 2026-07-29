import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from './src/config/supabase';
import ProfileScreen from './src/screens/ProfileScreen';
import StudentDrawer from './src/screens/StudentDrawer';
import QRScreen from './src/screens/QRScreen';
import GeofenceScreen from './src/screens/GeofenceScreen';
import AIAssistantScreen from './src/screens/AIAssistantScreen';
import LeaderDashboard from './src/screens/LeaderDashboard';
import AdminDrawer from './src/screens/AdminDrawer';
import LeaderDrawer from './src/screens/LeaderDrawer';
import CreateEventScreen from './src/screens/CreateEventScreen';
import AdminDashboard from './src/screens/AdminDashboard';
import WelcomeScreen from './src/screens/WelcomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

function LoginScreen({ route, navigation }) {
  const { role } = route.params || { role: 'student' };
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const roleConfig = {
    student: { title: 'Student Sign In', btnColor: '#8B1A1A' }, // maroon
    leader: { title: 'Club Leader Sign In', btnColor: '#D4AF37' }, // gold
    admin: { title: 'University Admin Sign In', btnColor: '#10B981' } // green
  };
  
  const currentConfig = roleConfig[role] || roleConfig.student;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image 
          source={require('./assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: currentConfig.btnColor }]}>{currentConfig.title}</Text>
        <Text style={styles.subtitle}>Sign in to your CoordCamp account</Text>

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
          style={styles.forgotPasswordButton}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: currentConfig.btnColor }]} 
          onPress={handleLogin} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.buttonText, role === 'leader' && { color: '#1C2E4A' }]}>Sign In</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          New here?{' '}
          <Text 
            style={[styles.footerLink, { color: currentConfig.btnColor }]}
            onPress={() => navigation.navigate('Register', { role })}
          >
            Create Account
          </Text>
        </Text>
      </View>
    </View>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [initializing, setInitializing] = useState(true);

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (!error && data) {
        setProfile(data);
      }
    } catch (err) {
      console.log('Error fetching profile:', err.message);
    } finally {
      setInitializing(false);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setInitializing(false);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setInitializing(false);
      }
    });
  }, []);

  if (initializing) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#8B1A1A" />
      </View>
    );
  }

  const isLeader = profile?.role === 'clubLeader';
  const isAdmin = profile?.role === 'admin';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {session && session.user ? (
            isAdmin ? (
              <>
                <Stack.Screen name="AdminDrawer" component={AdminDrawer} />
              </>
            ) : isLeader ? (
              <>
                <Stack.Screen name="LeaderDrawer" component={LeaderDrawer} />
                <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={{ headerShown: true, title: 'Create Event' }} />
              </>
            ) : (
              <>
                <Stack.Screen name="StudentDrawer" component={StudentDrawer} />
                <Stack.Screen name="QR" component={QRScreen} options={{ headerShown: true, title: 'Scan QR' }} />
                <Stack.Screen name="Geofence" component={GeofenceScreen} options={{ headerShown: true, title: 'Geofence Check-in' }} />
              </>
            )
          ) : (
            <>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6', // cc-offwhite
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B1A1A', // cc-maroon
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
    paddingRight: 16,
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
  forgotPassword: {
    color: '#1C2E4A', // cc-navy
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 24,
  },
  button: {
    width: '100%',
    height: 60,
    backgroundColor: '#8B1A1A', // cc-maroon
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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
