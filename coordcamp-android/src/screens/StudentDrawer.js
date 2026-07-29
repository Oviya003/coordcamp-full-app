import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image } from 'react-native';
import { supabase } from '../config/supabase';

import StudentDashboard from './StudentDashboard';
import EventsScreen from './EventsScreen';
import CreditsScreen from './CreditsScreen';
import ClubsScreen from './ClubsScreen';
import AIAssistantScreen from './AIAssistantScreen';
import ProfileScreen from './ProfileScreen';
import NotificationsScreen from './NotificationsScreen';
import SettingsScreen from './SettingsScreen';

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
      <Text style={styles.sectionTitle}>STUDENT PORTAL</Text>
      
      <View style={{ flex: 1 }}>
        <DrawerItemList {...props} />
      </View>

      <View style={styles.footer}>
        <DrawerItem 
          label="Logout" 
          onPress={handleLogout}
          labelStyle={styles.logoutText}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function StudentDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#8B1A1A', // cc-maroon
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
        component={StudentDashboard} 
        options={{ drawerLabel: '🏠 Dashboard' }}
      />
      <Drawer.Screen 
        name="Events" 
        component={EventsScreen} 
        options={{ drawerLabel: '📅 Events' }}
      />
      <Drawer.Screen 
        name="Credits" 
        component={CreditsScreen} 
        options={{ drawerLabel: '🏅 Credits' }}
      />
      <Drawer.Screen 
        name="Clubs" 
        component={ClubsScreen} 
        options={{ drawerLabel: '👥 Clubs' }}
      />
      <Drawer.Screen 
        name="AIAssistant" 
        component={AIAssistantScreen} 
        options={{ drawerLabel: '🤖 AI Assistant', title: 'AI Assistant' }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ drawerLabel: '👤 Profile' }}
      />
      <Drawer.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{ drawerLabel: '🔔 Notifications' }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ drawerLabel: '⚙️ Settings' }}
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
