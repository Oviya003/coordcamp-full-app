import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function ClubsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Discover Clubs</Text>
      
      <View style={styles.clubCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.clubName}>Music club</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Arts</Text>
          </View>
          <Text style={styles.description}>
            A music club is a vibrant community space where vocalists, instrumentalists, and music lovers gather to...
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 24,
  },
  clubCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 24,
  },
  cardHeader: {
    backgroundColor: '#2F747F', // teal matching web
    padding: 24,
  },
  clubName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardBody: {
    padding: 24,
  },
  tag: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  tagText: {
    color: '#00796B',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#1C2E4A',
    fontWeight: 'bold',
  }
});
