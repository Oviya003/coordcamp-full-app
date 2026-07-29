import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../config/supabase';

export default function LeaderDashboard({ navigation }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeMembers: 0,
    attendanceRate: 0,
    creditsDistributed: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchData(userId) {
    try {
      setLoading(true);
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      setProfile(profileData);

      const { data: eventsData } = await supabase
        .from('events')
        .select('id, title, date')
        .eq('created_by', userId)
        .order('date', { ascending: false })
        .limit(3);
        
      if (eventsData) {
        setRecentEvents(eventsData);
      }

      // Fetch actual stats
      const [
        { count: eventsCount },
        membersRes,
        { count: attendanceCount }
      ] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('created_by', userId),
        supabase.from('club_members').select('*', { count: 'exact', head: true }), // Fallback handled below
        supabase.from('attendance').select('*', { count: 'exact', head: true })
      ]);
      const membersCount = membersRes.count || 0;

      setStats({
        totalEvents: eventsCount || 0,
        activeMembers: membersCount || 24, // Mock fallback if 0
        attendanceRate: attendanceCount ? Math.min(100, attendanceCount * 12) : 0, 
        creditsDistributed: (attendanceCount || 0) * 15, // Mock logic for credits
      });
    } catch (error) {
      console.log('Error fetching dashboard data:', error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchData(session.user.id);
      } else {
        setLoading(false);
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
          <Text style={styles.welcomeText}>Club Leader Dashboard</Text>
          <Text style={styles.subtitleText}>Manage your organization and events.</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton} 
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileButtonIcon}>👤</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateEvent')}
      >
        <Text style={styles.createButtonIcon}>+</Text>
        <Text style={styles.createButtonText}>Create Event</Text>
      </TouchableOpacity>

      <View style={styles.kpiContainer}>
        <View style={styles.kpiCard}>
          <View>
            <Text style={styles.kpiLabel}>TOTAL EVENTS</Text>
            <Text style={styles.kpiValue}>{stats.totalEvents}</Text>
          </View>
          <View style={[styles.kpiIconBox, { backgroundColor: '#FEE2E2' }]}>
            <Text style={styles.kpiIcon}>📅</Text>
          </View>
        </View>

        <View style={styles.kpiCard}>
          <View>
            <Text style={styles.kpiLabel}>ACTIVE MEMBERS</Text>
            <Text style={styles.kpiValue}>{stats.activeMembers}</Text>
          </View>
          <View style={[styles.kpiIconBox, { backgroundColor: '#DBEAFE' }]}>
            <Text style={styles.kpiIcon}>👥</Text>
          </View>
        </View>

        <View style={styles.kpiCard}>
          <View>
            <Text style={styles.kpiLabel}>ATTENDANCE RATE</Text>
            <Text style={styles.kpiValue}>{stats.attendanceRate}%</Text>
          </View>
          <View style={[styles.kpiIconBox, { backgroundColor: '#DCFCE7' }]}>
            <Text style={styles.kpiIcon}>✅</Text>
          </View>
        </View>

        <View style={styles.kpiCard}>
          <View>
            <Text style={styles.kpiLabel}>CREDITS GIVEN</Text>
            <Text style={styles.kpiValue}>{stats.creditsDistributed}</Text>
          </View>
          <View style={[styles.kpiIconBox, { backgroundColor: '#FEF9C3' }]}>
            <Text style={styles.kpiIcon}>🏆</Text>
          </View>
        </View>
      </View>

      <View style={styles.eventsCard}>
        <View style={styles.eventsHeader}>
          <Text style={styles.eventsTitle}>📋 Manage Events</Text>
          <Text style={styles.eventsLink}>View All</Text>
        </View>
        <View style={styles.eventList}>
          {recentEvents.length === 0 ? (
             <Text style={styles.emptyStateText}>No events found.</Text>
          ) : (
            recentEvents.map(event => (
              <View key={event.id} style={styles.eventRow}>
                <View>
                  <Text style={styles.eventRowTitle}>{event.title}</Text>
                  <Text style={styles.eventRowDate}>{new Date(event.date).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.manageLink}>Manage</Text>
              </View>
            ))
          )}
        </View>
      </View>
      
      <View style={styles.creditsCard}>
        <Text style={styles.creditsTitle}>Credits Allocation</Text>
        <Text style={styles.creditsSubtitle}>Manage budget and credits for your club events.</Text>
        
        <View style={styles.balanceBox}>
          <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
          <Text style={styles.balanceValue}>2,450 <Text style={styles.balanceUnit}>pts</Text></Text>
        </View>
        
        <TouchableOpacity style={styles.allocateButton}>
          <Text style={styles.allocateButtonText}>Allocate Credits</Text>
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
    backgroundColor: '#FFFFFF',
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
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  profileButtonIcon: {
    fontSize: 20,
  },
  createButton: {
    backgroundColor: '#8B1A1A', // cc-maroon
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
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
    marginBottom: 24,
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
    marginBottom: 16,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C2E4A',
  },
  eventsLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B1A1A', // cc-maroon
  },
  eventList: {
    marginTop: 8,
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  eventRowTitle: {
    fontWeight: 'bold',
    color: '#1C2E4A',
    fontSize: 16,
    marginBottom: 4,
  },
  eventRowDate: {
    color: '#6B7280',
    fontSize: 14,
  },
  manageLink: {
    color: '#D4AF37', // cc-gold
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyStateText: {
    color: '#6B7280',
    fontStyle: 'italic',
    paddingVertical: 12,
  },
  creditsCard: {
    backgroundColor: '#1C2E4A', // cc-navy
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  creditsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  creditsSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 24,
  },
  balanceBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
  },
  balanceLabel: {
    color: '#D4AF37', // cc-gold
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  balanceUnit: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  allocateButton: {
    backgroundColor: '#D4AF37', // cc-gold
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  allocateButtonText: {
    color: '#1C2E4A',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
