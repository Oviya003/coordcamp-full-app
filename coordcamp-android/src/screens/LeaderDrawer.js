import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image } from 'react-native';
import { supabase } from '../config/supabase';

import LeaderDashboard from './LeaderDashboard';
import CreateClubScreen from './CreateClubScreen';
import EventsScreen from './EventsScreen';
import MembersScreen from './MembersScreen';
import AttendanceScreen from './AttendanceScreen';
import AnnouncementsScreen from './AnnouncementsScreen';
import CreditsScreen from './CreditsScreen';
import AIAssistantScreen from './AIAssistantScreen';
import SettingsScreen from './SettingsScreen';
import ProfileScreen from './ProfileScreen';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.drawerHeader}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.brandName}>CoordCamp</Text>
      </View>
      <Text style={styles.sectionTitle}>CLUB MANAGEMENT</Text>
      
      <View style={{ flex: 1 }}>
        <DrawerItemList {...props} />
      </View>

      <View style={styles.footer}>
        <DrawerItem 
          label="Profile" 
          onPress={() => props.navigation.navigate('Profile')}
          labelStyle={{ color: '#1C2E4A', fontWeight: '600' }}
        />
        <DrawerItem 
          label="Logout" 
          onPress={handleLogout}
          labelStyle={styles.logoutText}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function LeaderDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#8B1A1A', // maroon for leader (or gold #D4AF37) - web uses maroon header
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveBackgroundColor: '#8B1A1A',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#1C2E4A',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
          marginLeft: -10,
        },
      }}
    >
      <Drawer.Screen 
        name="Dashboard" 
        component={LeaderDashboard} 
        options={{ drawerLabel: '🏠 Dashboard' }}
      />
      <Drawer.Screen 
        name="CreateClub" 
        component={CreateClubScreen} 
        options={{ drawerLabel: '➕ Create Club' }}
      />
      <Drawer.Screen 
        name="Events" 
        component={EventsScreen} 
        options={{ drawerLabel: '📅 Events' }}
      />
      <Drawer.Screen 
        name="Members" 
        component={MembersScreen} 
        options={{ drawerLabel: '👥 Members' }}
      />
      <Drawer.Screen 
        name="Attendance" 
        component={AttendanceScreen} 
        options={{ drawerLabel: '✅ Attendance' }}
      />
      <Drawer.Screen 
        name="Credits" 
        component={CreditsScreen} 
        options={{ drawerLabel: '💳 Credits' }}
      />
      <Drawer.Screen 
        name="Announcements" 
        component={AnnouncementsScreen} 
        options={{ drawerLabel: '📣 Announcements' }}
      />
      <Drawer.Screen 
        name="AIAssistant" 
        component={AIAssistantScreen} 
        options={{ drawerLabel: '🤖 AI Assistant', title: 'AI Assistant' }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ drawerLabel: '⚙️ Settings' }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          drawerLabel: '👤 Profile',
          drawerItemStyle: { display: 'none' } // Hide from list
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 10,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  brandName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B1A1A',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginLeft: 20,
    marginBottom: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingBottom: 20,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: 'bold',
    marginLeft: -10,
    fontSize: 16,
  }
});
