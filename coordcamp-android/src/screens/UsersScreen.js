import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function UsersScreen() {
  const users = [
    { id: 1, name: 'Anna Student', role: 'Student', email: 'anna@university.edu' },
    { id: 2, name: 'John Leader', role: 'Club Leader', email: 'john@university.edu' },
    { id: 3, name: 'Sarah Admin', role: 'Admin', email: 'sarah@university.edu' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>User Directory</Text>
          <Text style={styles.subtitle}>Manage platform access and roles.</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add User</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.card}>
        <View style={styles.tableHeader}>
          <Text style={[styles.columnHeader, { flex: 2 }]}>USER</Text>
          <Text style={[styles.columnHeader, { flex: 1 }]}>ROLE</Text>
        </View>

        {users.map((user, index) => (
          <View key={user.id} style={[styles.row, index === users.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={{ flex: 2 }}>
              <Text style={styles.nameCell}>{user.name}</Text>
              <Text style={styles.emailCell}>{user.email}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <View style={[styles.roleBadge, user.role === 'Admin' ? styles.adminBadge : user.role === 'Club Leader' ? styles.leaderBadge : null]}>
                <Text style={[styles.roleText, user.role === 'Admin' ? styles.adminText : user.role === 'Club Leader' ? styles.leaderText : null]}>{user.role}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 32,
    paddingBottom: 48,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10B981', // Admin Green
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#1C2E4A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  columnHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  row: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  nameCell: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C2E4A',
    marginBottom: 2,
  },
  emailCell: {
    fontSize: 12,
    color: '#6B7280',
  },
  roleBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: 'bold',
  },
  leaderBadge: {
    backgroundColor: '#FEF9C3',
  },
  leaderText: {
    color: '#A16207',
  },
  adminBadge: {
    backgroundColor: '#DCFCE7',
  },
  adminText: {
    color: '#15803D',
  }
});
