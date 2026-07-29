import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../config/supabase';

export default function AdminDashboard({ navigation }) {
  const [session, setSession] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClubs: 0,
    totalEvents: 0,
    attendanceRate: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      setLoading(true);
      
      const [
        { count: studentsCount },
        { count: clubsCount },
        { count: eventsCount },
        { count: attendanceCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('clubs').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('attendance').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        totalStudents: studentsCount || 0,
        totalClubs: clubsCount || 0,
        totalEvents: eventsCount || 0,
        attendanceRate: attendanceCount > 0 ? 85 : 0, 
        pendingApprovals: 2, // Mocked for UI
      });
      
    } catch (error) {
      console.log('Error fetching admin data:', error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchData();
      } else {
        setLoading(false);
      }
    });
  }, []);

  const alerts = [
    { id: 1, message: 'Suspicious check-in activity at Event #402', time: '10 mins ago' },
    { id: 2, message: 'Club "Tech Society" requires faculty approval', time: '1 hour ago' },
  ];

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.welcomeText}>University Admin</Text>
          <Text style={styles.subtitleText}>Platform-wide statistics and management.</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton} 
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileButtonIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.kpiContainer}>
        <View style={styles.kpiCard}>
          <View>
            <Text style={styles.kpiLabel}>TOTAL STUDENTS</Text>
            <Text style={styles.kpiValue}>{stats.totalStudents}</Text>
          </View>
          <View style={[styles.kpiIconBox, { backgroundColor: '#FEF9C3' }]}>
            <Text style={styles.kpiIcon}>👥</Text>
          </View>
        </View>

        <View style={styles.kpiCard}>
          <View>
            <Text style={styles.kpiLabel}>TOTAL CLUBS</Text>
            <Text style={styles.kpiValue}>{stats.totalClubs}</Text>
          </View>
          <View style={[styles.kpiIconBox, { backgroundColor: '#FEE2E2' }]}>
            <Text style={styles.kpiIcon}>🛡️</Text>
          </View>
        </View>

        <View style={styles.kpiCard}>
          <View>
            <Text style={styles.kpiLabel}>TOTAL EVENTS</Text>
            <Text style={styles.kpiValue}>{stats.totalEvents}</Text>
          </View>
          <View style={[styles.kpiIconBox, { backgroundColor: '#DBEAFE' }]}>
            <Text style={styles.kpiIcon}>📅</Text>
          </View>
        </View>

        <View style={styles.kpiCard}>
          <View>
            <Text style={styles.kpiLabel}>ATTENDANCE %</Text>
            <Text style={styles.kpiValue}>{stats.attendanceRate}%</Text>
          </View>
          <View style={[styles.kpiIconBox, { backgroundColor: '#D1FAE5' }]}>
            <Text style={styles.kpiIcon}>📊</Text>
          </View>
        </View>
      </View>

      {/* Pending Approvals Special Card */}
      <View style={styles.pendingCard}>
        <View style={styles.pendingHeader}>
          <Text style={styles.pendingLabel}>PENDING APPROVALS</Text>
          <Text style={styles.pendingIcon}>⚠️</Text>
        </View>
        <Text style={styles.pendingValue}>{stats.pendingApprovals}</Text>
      </View>

      {/* Alerts Section */}
      <View style={styles.alertsCard}>
        <Text style={styles.alertsTitle}>🚨 Fraud Alerts</Text>
        <View style={styles.alertsList}>
          {alerts.map(alert => (
            <View key={alert.id} style={styles.alertRow}>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.alertTime}>{alert.time}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.outlineButton}>
          <Text style={styles.outlineButtonText}>View All Logs</Text>
        </TouchableOpacity>
      </View>
      
      {/* Admin AI Section */}
      <View style={styles.aiCard}>
        <Text style={styles.aiTitle}>🤖 Admin AI</Text>
        <Text style={styles.aiSubtitle}>Use the AI assistant to query campus-wide data, summarize incidents, or draft communications.</Text>
        
        <TouchableOpacity 
          style={styles.aiButton}
          onPress={() => navigation.navigate('AIAssistant')}
        >
          <Text style={styles.aiButtonText}>Open Assistant</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6', // cc-offwhite
  },
  contentContainer: {
    padding: 16,
    paddingTop: 32,
    paddingBottom: 48,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B1A1A', // cc-maroon
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: '#1C2E4A', // cc-navy
    fontWeight: '600',
  },
  profileButton: {
    backgroundColor: '#1C2E4A',
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileButtonIcon: {
    fontSize: 20,
    color: 'white',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C2E4A',
  },
  kpiIconBox: {
    padding: 8,
    borderRadius: 12,
  },
  kpiIcon: {
    fontSize: 16,
  },
  pendingCard: {
    backgroundColor: '#8B1A1A', // cc-maroon
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  pendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pendingLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: 'bold',
    fontSize: 12,
  },
  pendingIcon: {
    fontSize: 24,
  },
  pendingValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  alertsCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FEE2E2', // red-100
  },
  alertsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B1A1A',
    marginBottom: 16,
  },
  alertsList: {
    marginBottom: 16,
  },
  alertRow: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  alertMessage: {
    fontWeight: 'bold',
    color: '#8B1A1A',
    marginBottom: 4,
    fontSize: 14,
  },
  alertTime: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '600',
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: '#8B1A1A',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#8B1A1A',
    fontWeight: 'bold',
    fontSize: 14,
  },
  aiCard: {
    backgroundColor: '#1C2E4A', // cc-navy
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  aiTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  aiSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  aiButton: {
    backgroundColor: '#D4AF37', // cc-gold
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  aiButtonText: {
    color: '#1C2E4A',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
