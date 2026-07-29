import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../config/supabase';

export default function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .gte('date', new Date().toISOString())
          .order('date', { ascending: true });
        
        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        console.log('Error fetching events:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
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
      <View style={styles.header}>
        <Text style={styles.title}>Campus Events</Text>
        <Text style={styles.subtitle}>Discover and register for upcoming activities.</Text>
      </View>
      
      {events.length === 0 ? (
        <Text style={styles.emptyText}>No events found.</Text>
      ) : (
        events.map(event => (
          <View key={event.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle} numberOfLines={1}>{event.title}</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{event.category}</Text>
              </View>
              <Text style={styles.description} numberOfLines={2}>{event.description}</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.icon}>📅</Text>
                <Text style={styles.infoText}>{new Date(event.date).toLocaleDateString()}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.icon}>📍</Text>
                <Text style={styles.infoText}>{event.location}</Text>
              </View>

              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B1A1A', // cc-maroon
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#1C2E4A', // cc-navy
  },
  emptyText: {
    color: '#6B7280',
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden', // to round the maroon header
  },
  cardHeader: {
    backgroundColor: '#8B1A1A', // cc-maroon
    padding: 24,
    height: 96,
    justifyContent: 'flex-end',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardBody: {
    padding: 24,
  },
  categoryBadge: {
    backgroundColor: '#FEF9C3', // cc-cream
    borderColor: 'rgba(139, 26, 26, 0.2)', // maroon/20
    borderWidth: 1,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 12,
  },
  categoryText: {
    color: '#8B1A1A',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    color: '#4B5563',
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 16,
    marginRight: 12,
  },
  infoText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#8B1A1A', // cc-maroon
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
