import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Your Path</Text>
          <Text style={styles.subtitle}>
            Join the university community and manage your extracurricular life with ease.
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {/* Student Card */}
          <TouchableOpacity 
            style={[styles.card, { borderLeftColor: '#8B1A1A' }]}
            onPress={() => navigation.navigate('Login', { role: 'student' })}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
              <Text style={styles.icon}>🎓</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Student</Text>
              <Text style={styles.cardDesc}>
                Explore clubs and manage your campus involvement.
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Club Leader Card */}
          <TouchableOpacity 
            style={[styles.card, { borderLeftColor: '#D4AF37' }]}
            onPress={() => navigation.navigate('Login', { role: 'leader' })}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FEF9C3' }]}>
              <Text style={styles.icon}>👥</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Club Leader</Text>
              <Text style={styles.cardDesc}>
                Manage your organization and host camp events.
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Admin Card */}
          <TouchableOpacity 
            style={[styles.card, { borderLeftColor: '#10B981' }]}
            onPress={() => navigation.navigate('Login', { role: 'admin' })}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
              <Text style={styles.icon}>🏢</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>University Admin</Text>
              <Text style={styles.cardDesc}>
                Oversee university-wide programs and safety.
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
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
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#8B1A1A', // cc-maroon
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280', // gray-500
    textAlign: 'center',
    fontWeight: '600',
    maxWidth: 300,
    lineHeight: 24,
  },
  cardsContainer: {
    width: '100%',
    maxWidth: 500,
  },
  card: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    marginBottom: 20,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  icon: {
    fontSize: 28,
  },
  cardContent: {
    flex: 1,
    paddingRight: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C2E4A', // cc-navy
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    lineHeight: 20,
  },
  chevron: {
    fontSize: 32,
    color: '#D1D5DB', // gray-300
    fontWeight: '300',
  }
});
