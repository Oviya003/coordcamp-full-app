import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../config/supabase';

export default function ProfileScreen() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.log('Error fetching profile:', error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('Error', error.message);
  };

  if (loading || !session) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B1A1A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>My Profile</Text>

        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.nameText}>
              {profile?.full_name || session.user.email?.split('@')[0] || 'User'}
            </Text>
            <Text style={styles.roleText}>
              🛡️ {profile?.role === 'clubLeader' ? 'Club Leader' : profile?.role || 'User'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <View style={styles.emailBox}>
            <Text style={styles.icon}>✉️</Text>
            <Text style={styles.emailText}>{session.user.email}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
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
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B1A1A', // cc-maroon
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF9C3', // cc-cream/yellow-50
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
  },
  profileInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C2E4A', // cc-navy
    marginBottom: 4,
  },
  roleText: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  section: {
    marginTop: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  emailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  icon: {
    fontSize: 16,
    marginRight: 12,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C2E4A',
  },
  logoutButton: {
    marginTop: 32,
    backgroundColor: '#FEE2E2', // red-50
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutButtonText: {
    color: '#8B1A1A', // cc-maroon
    fontWeight: 'bold',
    fontSize: 16,
  }
});
