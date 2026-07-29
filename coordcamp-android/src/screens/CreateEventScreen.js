import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRef } from 'react';
import { supabase } from '../config/supabase';

export default function CreateEventScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    date: '', 
    location: '', 
    radius_meters: '100',
    category: 'General',
    capacity: '100',
    credits: '10',
    attendance_mode: 'qr',
    latitude: null,
    longitude: null
  });

  const webviewRef = useRef(null);

  const leafletHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
        body { padding: 0; margin: 0; }
        html, body, #map { height: 100%; width: 100%; }
        .loc-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 1000;
          background: #FEE2E2;
          color: #8B1A1A;
          border: 1px solid #FCA5A5;
          padding: 8px 12px;
          border-radius: 8px;
          font-family: sans-serif;
          font-weight: bold;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <button class="loc-btn" onclick="requestLocation()">📍 Use My Location</button>
      <script>
        var map = L.map('map').setView([37.7749, -122.4194], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(map);
        
        var marker;

        function setPin(lat, lng) {
          if (marker) { map.removeLayer(marker); }
          marker = L.marker([lat, lng]).addTo(map);
          map.setView([lat, lng], 15);
        }

        map.on('click', function(e) {
          var lat = e.latlng.lat;
          var lng = e.latlng.lng;
          setPin(lat, lng);
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'location', lat: lat, lng: lng }));
        });

        function requestLocation() {
          map.locate({setView: true, maxZoom: 16});
        }

        map.on('locationfound', function(e) {
          var lat = e.latlng.lat;
          var lng = e.latlng.lng;
          setPin(lat, lng);
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'location', lat: lat, lng: lng }));
        });

        map.on('locationerror', function(e) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', msg: e.message }));
        });
      </script>
    </body>
    </html>
  `;

  const handleSubmit = async () => {
    if (!formData.title || !formData.date || !formData.location) {
      Alert.alert('Error', 'Please fill out title, date, and location.');
      return;
    }

    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase.from('events').insert({
        title: formData.title,
        description: formData.description,
        date: new Date(formData.date).toISOString(), // Naive for RN demo
        location: formData.location,
        location: formData.location,
        latitude: formData.attendance_mode === 'geofence' ? formData.latitude : null,
        longitude: formData.attendance_mode === 'geofence' ? formData.longitude : null,
        radius_meters: formData.attendance_mode === 'geofence' ? parseInt(formData.radius_meters) || 100 : null,
        category: formData.category,
        capacity: parseInt(formData.capacity) || 100,
        credits: parseInt(formData.credits) || 10,
        attendance_mode: formData.attendance_mode,
        created_by: session.user.id
      });

      if (error) throw error;
      
      Alert.alert('Success', 'Event successfully created!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Create New Event</Text>
      <Text style={styles.subtitle}>Set up your event details.</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Event Title</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Welcome Week Kickoff" 
          placeholderTextColor="#9CA3AF"
          value={formData.title}
          onChangeText={(val) => setFormData({...formData, title: val})}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="What is this event about?"
          placeholderTextColor="#9CA3AF" 
          multiline
          numberOfLines={3}
          value={formData.description}
          onChangeText={(val) => setFormData({...formData, description: val})}
        />

        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="2026-09-01" 
              placeholderTextColor="#9CA3AF"
              value={formData.date}
              onChangeText={(val) => setFormData({...formData, date: val})}
            />
          </View>
          <View style={styles.flex1}>
            <Text style={styles.label}>Location Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Student Union" 
              placeholderTextColor="#9CA3AF"
              value={formData.location}
              onChangeText={(val) => setFormData({...formData, location: val})}
            />
          </View>
        </View>

        <Text style={styles.label}>Attendance Tracking Method</Text>
        <View style={styles.modeContainer}>
          <TouchableOpacity 
            style={[styles.modeButton, formData.attendance_mode === 'geofence' && styles.modeButtonActive]}
            onPress={() => setFormData({...formData, attendance_mode: 'geofence'})}
          >
            <Text style={[styles.modeText, formData.attendance_mode === 'geofence' && styles.modeTextActive]}>📍 Geofence</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeButton, formData.attendance_mode === 'qr' && styles.modeButtonActive]}
            onPress={() => setFormData({...formData, attendance_mode: 'qr'})}
          >
            <Text style={[styles.modeText, formData.attendance_mode === 'qr' && styles.modeTextActive]}>📱 QR Code</Text>
          </TouchableOpacity>
        </View>

        {formData.attendance_mode === 'geofence' && (
          <View style={styles.mapSection}>
            <Text style={styles.label}>Set Location Pin (Tap Map)</Text>
            <View style={styles.mapContainer}>
              <WebView
                ref={webviewRef}
                style={{ flex: 1 }}
                originWhitelist={['*']}
                source={{ html: leafletHTML }}
                geolocationEnabled={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onMessage={(event) => {
                  try {
                    const data = JSON.parse(event.nativeEvent.data);
                    if (data.type === 'location') {
                      setFormData({...formData, latitude: data.lat, longitude: data.lng});
                    } else if (data.type === 'error') {
                      Alert.alert('Location Error', 'Could not access your location from the map.');
                    }
                  } catch(e){}
                }}
              />
            </View>
            <Text style={styles.label}>Radius (meters)</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric"
              value={formData.radius_meters}
              onChangeText={(val) => setFormData({...formData, radius_meters: val})}
            />
          </View>
        )}

        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text style={styles.label}>Category</Text>
            <TextInput 
              style={styles.input} 
              value={formData.category}
              onChangeText={(val) => setFormData({...formData, category: val})}
            />
          </View>
          <View style={styles.flex1}>
            <Text style={styles.label}>Credits</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric"
              value={formData.credits}
              onChangeText={(val) => setFormData({...formData, credits: val})}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Publish Event</Text>
          )}
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B1A1A', // cc-maroon
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 24,
  },
  card: {
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
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C2E4A',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1C2E4A',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  flex1: {
    flex: 1,
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  modeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  modeButtonActive: {
    borderColor: '#8B1A1A',
    backgroundColor: '#FEE2E2', // red-50
  },
  modeText: {
    fontWeight: 'bold',
    color: '#6B7280',
  },
  modeTextActive: {
    color: '#8B1A1A',
  },
  mapSection: {
    marginTop: 16,
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  map: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#8B1A1A', // cc-maroon
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
