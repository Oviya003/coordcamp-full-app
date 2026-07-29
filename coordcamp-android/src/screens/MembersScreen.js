import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function MembersScreen() {
  const members = [
    { id: 1, name: 'Alice Johnson', role: 'President', joinDate: '2026-01-15' },
    { id: 2, name: 'Bob Smith', role: 'Member', joinDate: '2026-02-20' },
    { id: 3, name: 'Charlie Davis', role: 'Member', joinDate: '2026-03-10' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Club Members</Text>
          <Text style={styles.subtitle}>Manage your organization roster.</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Invite</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.card}>
        <View style={styles.tableHeader}>
          <Text style={[styles.columnHeader, { flex: 2 }]}>NAME</Text>
          <Text style={[styles.columnHeader, { flex: 1 }]}>ROLE</Text>
          <Text style={[styles.columnHeader, { flex: 1, textAlign: 'right' }]}>JOINED</Text>
        </View>

        {members.map((member, index) => (
          <View key={member.id} style={[styles.row, index === members.length - 1 && { borderBottomWidth: 0 }]}>
            <Text style={[styles.cell, styles.nameCell, { flex: 2 }]}>{member.name}</Text>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <View style={[styles.roleBadge, member.role === 'President' && styles.presidentBadge]}>
                <Text style={[styles.roleText, member.role === 'President' && styles.presidentText]}>{member.role}</Text>
              </View>
            </View>
            <Text style={[styles.cell, styles.dateCell, { flex: 1, textAlign: 'right' }]}>{member.joinDate}</Text>
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
    color: '#8B1A1A',
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
  cell: {
    fontSize: 14,
    color: '#1C2E4A',
  },
  nameCell: {
    fontWeight: 'bold',
  },
  dateCell: {
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
  presidentBadge: {
    backgroundColor: '#FEF9C3',
  },
  presidentText: {
    color: '#A16207',
  }
});
