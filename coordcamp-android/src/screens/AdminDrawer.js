import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image } from 'react-native';
import { supabase } from '../config/supabase';

import AdminDashboard from './AdminDashboard';
import UsersScreen from './UsersScreen';
import EventsScreen from './EventsScreen';
import ReportsScreen from './ReportsScreen';
import AnalyticsScreen from './AnalyticsScreen';
import AIAssistantScreen from './AIAssistantScreen';
import SettingsScreen from './SettingsScreen';
import ProfileScreen from './ProfileScreen';

// Placeholder screens for Admin
function PlaceholderScreen({ route }) {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>{route.name} Dashboard coming soon!</Text>
    </View>
  );
}

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
      <Text style={styles.sectionTitle}>UNIVERSITY ADMIN</Text>
      
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

export default function AdminDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#10B981', // green for admin
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveBackgroundColor: '#10B981',
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
        component={AdminDashboard} 
        options={{ drawerLabel: '🏠 Dashboard' }}
      />
      <Drawer.Screen 
        name="Users" 
        component={UsersScreen} 
        options={{ drawerLabel: '👥 Users' }}
      />
      <Drawer.Screen 
        name="Clubs" 
        component={EventsScreen} // Can point to events for now as a directory
        options={{ drawerLabel: '🏛️ Clubs' }}
      />
      <Drawer.Screen 
        name="Events" 
        component={EventsScreen} 
        options={{ drawerLabel: '📅 Events' }}
      />
      <Drawer.Screen 
        name="Reports" 
        component={ReportsScreen} 
        options={{ drawerLabel: '🚩 Reports' }}
      />
      <Drawer.Screen 
        name="Analytics" 
        component={AnalyticsScreen} 
        options={{ drawerLabel: '📊 Analytics' }}
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
          drawerItemStyle: { display: 'none' } // Hide from main list, can be accessed elsewhere if needed
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
    color: '#10B981',
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
