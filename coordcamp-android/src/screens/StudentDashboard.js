import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../config/supabase';

export default function StudentDashboard({ navigation }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    attendanceRate: 0,
    activeClubs: 0,
    upcomingEvents: []
  });
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

      // Fetch upcoming events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .limit(3);

      // Fetch attendance count
      const { count: attendanceCount } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Fetch clubs count (assuming 'club_members' exists, fallback to 0)
      const { count: clubsCount, error: clubsError } = await supabase
        .from('club_members')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      setDashboardData({
        attendanceRate: attendanceCount ? Math.min(100, attendanceCount * 15) : 0, // Mock calculation for now
        activeClubs: clubsCount || 1, // Mock fallback
        upcomingEvents: eventsData || []
      });

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

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B1A1A" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.welcomeText}>
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'}
          </Text>
          <Text style={styles.subtitleText}>Your Campus Life at a Glance</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton} 
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileButtonIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.kpiContainer}>
        <View style={styles.kpiCard}>
          <View>
            <Text style={styles.kpiLabel}>CREDITS</Text>
            <Text style={styles.kpiValue}>{profile?.credits || 0}</Text>
          </View>
          <View style={[styles.kpiIconBox, { backgroundColor: '#FEF9C3' }]}>
            <Text style={styles.kpiIcon}>🏆</Text>
          </View>
        </View>

        <View style={styles.kpiCard}>
          <View>
            <Text style={styles.kpiLabel}>ATTENDANCE RATE</Text>
            <Text style={styles.kpiValue}>{dashboardData.attendanceRate}%</Text>
          </View>
          <View style={[styles.kpiIconBox, { backgroundColor: '#FEE2E2' }]}>
            <Text style={styles.kpiIcon}>📈</Text>
          </View>
        </View>

        <View style={styles.kpiCard}>
          <View>
            <Text style={styles.kpiLabel}>ACTIVE CLUBS</Text>
            <Text style={styles.kpiValue}>{dashboardData.activeClubs}</Text>
          </View>
          <View style={[styles.kpiIconBox, { backgroundColor: '#CCFBF1' }]}>
            <Text style={styles.kpiIcon}>👥</Text>
          </View>
        </View>

        <View style={[styles.kpiCard, styles.kpiCardMaroon]}>
          <View>
            <Text style={[styles.kpiLabel, { color: 'rgba(255,255,255,0.8)' }]}>CAMPUS RANK</Text>
            <Text style={[styles.kpiValue, { color: '#FFFFFF' }]}>#42</Text>
          </View>
          <View style={[styles.kpiIconBox, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Text style={styles.kpiIcon}>🏅</Text>
          </View>
        </View>
      </View>

      <View style={styles.eventsCard}>
        <View style={styles.eventsHeader}>
          <Text style={styles.eventsTitle}>📅 Upcoming Events</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Events')}>
            <Text style={styles.eventsLink}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {dashboardData.upcomingEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No events scheduled.</Text>
          </View>
        ) : (
          <View style={{ marginTop: 8 }}>
            {dashboardData.upcomingEvents.map(event => (
              <View key={event.id} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                <Text style={{ fontWeight: 'bold', color: '#1C2E4A', fontSize: 16, marginBottom: 4 }}>{event.title}</Text>
                <Text style={{ color: '#6B7280', fontSize: 14 }}>{new Date(event.date).toLocaleDateString()} • {event.location}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <View style={styles.twoColumnContainer}>
        <View style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertIcon}>🔔</Text>
            <Text style={styles.alertTitle}>Recent Alerts</Text>
          </View>
          <View style={styles.alertItem}>
            <Text style={styles.alertItemTitle}>[URGENT] assemble</Text>
            <Text style={styles.alertItemSub}>assemble at auditorium</Text>
          </View>
        </View>

        <View style={styles.clubCard}>
          <View style={styles.clubHeader}>
            <Text style={styles.clubIcon}>🧭</Text>
            <Text style={styles.clubTitle}>Suggested Clubs</Text>
          </View>
          <View style={styles.clubItem}>
            <View style={{flex: 1}}>
              <Text style={styles.clubItemTitle}>Music club</Text>
              <Text style={styles.clubItemSub}>Arts</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.clubLink}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.quickToolsCard}>
        <Text style={styles.quickToolsTitle}>Quick Tools</Text>
        <TouchableOpacity 
          style={styles.toolRow} 
          onPress={() => navigation.navigate('QR')}
        >
          <Text style={styles.toolIcon}>📷</Text>
          <Text style={styles.toolText}>Scan QR Code</Text>
          <Text style={styles.toolArrow}>→</Text>
        </TouchableOpacity>
        <View style={{ height: 12 }} />
        <TouchableOpacity 
          style={styles.toolRow} 
          onPress={() => navigation.navigate('Geofence')}
        >
          <Text style={styles.toolIcon}>📍</Text>
          <Text style={styles.toolText}>Geofence Check-in</Text>
          <Text style={styles.toolArrow}>→</Text>
        </TouchableOpacity>
        <View style={{ height: 12 }} />
        <TouchableOpacity 
          style={styles.toolRow} 
          onPress={() => {}}
        >
          <Text style={styles.toolIcon}>🏆</Text>
          <Text style={styles.toolText}>Achievements</Text>
          <Text style={styles.toolArrow}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.aiCard}>
        <View style={styles.aiHeader}>
          <Text style={styles.aiTitle}>AI Assistant</Text>
          <Text style={styles.aiHeaderIcon}>🤖</Text>
        </View>
        <Text style={styles.aiSubtitle}>Got questions about campus life, credits, or events? Ask your AI guide!</Text>
        
        <TouchableOpacity 
          style={styles.aiButton}
          onPress={() => navigation.navigate('AIAssistant')}
        >
          <Text style={styles.aiButtonIcon}>✨</Text>
          <Text style={styles.aiButtonText}>Chat Now</Text>
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
    paddingTop: 48,
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
    color: '#FFFFFF',
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
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
  kpiCardMaroon: {
    backgroundColor: '#8B1A1A',
    borderColor: '#8B1A1A',
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
  eventsCard: {
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
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C2E4A',
  },
  eventsLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4AF37', // cc-gold
  },
  emptyState: {
    backgroundColor: '#F9FAFB',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 14,
  },
  quickToolsCard: {
    backgroundColor: '#1C2E4A', // cc-navy
    padding: 24,
    borderRadius: 24,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  quickToolsTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 16,
  },
  toolIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  toolText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toolArrow: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 18,
  },
  twoColumnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 16,
  },
  alertCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B1A1A', // maroon
  },
  alertItem: {
    backgroundColor: '#F3F4F6', // light gray
    padding: 16,
    borderRadius: 12,
  },
  alertItemTitle: {
    fontWeight: 'bold',
    color: '#1C2E4A',
    marginBottom: 4,
    fontSize: 14,
  },
  alertItemSub: {
    color: '#6B7280',
    fontSize: 12,
  },
  clubCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  clubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  clubIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  clubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981', // green
  },
  clubItem: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clubItemTitle: {
    fontWeight: 'bold',
    color: '#1C2E4A',
    marginBottom: 4,
    fontSize: 14,
  },
  clubItemSub: {
    color: '#6B7280',
    fontSize: 12,
  },
  clubLink: {
    color: '#1C2E4A',
    fontWeight: 'bold',
    fontSize: 12,
  },
  aiCard: {
    backgroundColor: '#F3F4FF', // light blue tint
    padding: 24,
    borderRadius: 24,
    marginTop: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C2E4A',
  },
  aiHeaderIcon: {
    fontSize: 32,
    opacity: 0.2,
  },
  aiSubtitle: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  aiButton: {
    backgroundColor: '#4F46E5', // vibrant purple-blue
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  aiButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  aiButtonIcon: {
    fontSize: 16,
  }
});
