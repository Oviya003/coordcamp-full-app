import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRef } from 'react';
import { supabase } from '../config/supabase';

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function GeofenceScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('Select an event and verify your location.');
  const [userLocation, setUserLocation] = useState(null);
  const [user, setUser] = useState(null);
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
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {
          zoomControl: false,
          dragging: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          touchZoom: false
        }).setView([37.7749, -122.4194], 15);
        
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);
        
        var eventMarker, eventCircle, userMarker;

        var userIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41]
        });

        function updateMap(eventLat, eventLng, radius, userLat, userLng) {
          if (eventMarker) map.removeLayer(eventMarker);
          if (eventCircle) map.removeLayer(eventCircle);
          if (userMarker) map.removeLayer(userMarker);
          
          if (eventLat && eventLng) {
            map.setView([eventLat, eventLng], 16);
            eventMarker = L.marker([eventLat, eventLng]).addTo(map);
            eventCircle = L.circle([eventLat, eventLng], {
              color: 'rgba(139, 26, 26, 0.5)',
              fillColor: 'rgba(139, 26, 26, 0.2)',
              fillOpacity: 1,
              radius: radius || 100
            }).addTo(map);
          }

          if (userLat && userLng) {
            userMarker = L.marker([userLat, userLng], {icon: userIcon}).addTo(map);
          }
        }

        function requestLocation() {
          map.locate({setView: false});
        }

        map.on('locationfound', function(e) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'location', lat: e.latlng.lat, lng: e.latlng.lng }));
        });

        map.on('locationerror', function(e) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', msg: e.message }));
        });
      </script>
    </body>
    </html>
  `;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user);
    });

    const fetchEvents = async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date');
        
      if (data) {
        setEvents(data);
        if (data.length > 0) setSelectedEventId(data[0].id);
      }
    };
    fetchEvents();
  }, []);

  const selectedEvent = events.find(e => e.id === selectedEventId);

  useEffect(() => {
    if (webviewRef.current && (selectedEvent || userLocation)) {
      webviewRef.current.injectJavaScript(`
        if (typeof updateMap === 'function') {
          updateMap(${selectedEvent?.latitude || 'null'}, ${selectedEvent?.longitude || 'null'}, ${selectedEvent?.radius_meters || 100}, ${userLocation?.lat || 'null'}, ${userLocation?.lng || 'null'});
        }
        true;
      `);
    }
  }, [selectedEvent, userLocation]);

  const handleGeofenceCheckIn = () => {
    if (!selectedEvent?.latitude || !selectedEvent?.longitude) {
      setMessage("This event does not have a geofence configured.");
      setStatus('error');
      return;
    }

    setStatus('locating'); 
    setMessage('Acquiring GPS coordinates...');
    
    // Request location from webview
    webviewRef.current?.injectJavaScript(`
      requestLocation();
      true;
    `);
  };

  const processLocation = async (userLat, userLng) => {
    try {
      setUserLocation({ lat: userLat, lng: userLng });
      
      setStatus('checking');
      setMessage('Verifying distance...');
      
      const eventLat = selectedEvent.latitude;
      const eventLng = selectedEvent.longitude;
      const radius = selectedEvent.radius_meters || 100;
      
      const distance = calculateDistance(userLat, userLng, eventLat, eventLng);
      
      if (distance > radius) {
        setStatus('error');
        setMessage(`Check-in failed. You are ${Math.round(distance)}m away (max ${radius}m).`);
        return;
      }

      const { error } = await supabase.from('attendance').insert({
        event_id: selectedEventId,
        user_id: user.id,
        method: 'geofence'
      });

      if (error && error.code !== '23505') {
        throw error;
      }
      
      setStatus('success'); 
      setMessage('Attendance marked successfully! ✅');
      
    } catch (err) {
      setStatus('error'); 
      setMessage(err.message || 'Check-in failed');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Geofence Check-in</Text>
        <Text style={styles.subtitle}>Your location must be within the event radius.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Select Event:</Text>
        <View style={styles.eventList}>
          {events.length === 0 && <Text style={{color: '#6B7280'}}>No upcoming events available</Text>}
          {events.map(e => (
            <TouchableOpacity 
              key={e.id} 
              style={[styles.eventOption, selectedEventId === e.id && styles.eventOptionSelected]}
              onPress={() => setSelectedEventId(e.id)}
            >
              <Text style={[styles.eventOptionText, selectedEventId === e.id && styles.eventOptionTextSelected]}>{e.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedEvent?.latitude ? (
          <View style={styles.mapContainer}>
            <WebView
              ref={webviewRef}
              style={{ flex: 1 }}
              originWhitelist={['*']}
              source={{ html: leafletHTML }}
              geolocationEnabled={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              onLoadEnd={() => {
                if (selectedEvent) {
                  webviewRef.current.injectJavaScript(`
                    if (typeof updateMap === 'function') {
                      updateMap(${selectedEvent.latitude}, ${selectedEvent.longitude}, ${selectedEvent.radius_meters || 100}, ${userLocation?.lat || 'null'}, ${userLocation?.lng || 'null'});
                    }
                    true;
                  `);
                }
              }}
              onMessage={(event) => {
                try {
                  const data = JSON.parse(event.nativeEvent.data);
                  if (data.type === 'location') {
                    processLocation(data.lat, data.lng);
                  } else if (data.type === 'error') {
                    setStatus('error');
                    setMessage('Location access denied by map. ' + data.msg);
                  }
                } catch(e){}
              }}
            />
          </View>
        ) : (
          selectedEvent && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>This event does not have a GPS location configured.</Text>
            </View>
          )
        )}

        <View style={[
          styles.statusBox, 
          status === 'error' ? styles.statusError : 
          status === 'success' ? styles.statusSuccess : styles.statusIdle
        ]}>
          {status === 'locating' || status === 'checking' ? <ActivityIndicator size="small" color="#6B7280" /> : null}
          <Text style={[
            styles.statusText,
            status === 'error' ? styles.statusTextError : 
            status === 'success' ? styles.statusTextSuccess : styles.statusTextIdle
          ]}>{message}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.button, (status === 'locating' || status === 'checking' || !selectedEvent?.latitude || status === 'success') && styles.buttonDisabled]}
          onPress={handleGeofenceCheckIn}
          disabled={status === 'locating' || status === 'checking' || !selectedEvent?.latitude || status === 'success'}
        >
          <Text style={styles.buttonText}>Verify My Location 📍</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C2E4A',
    marginBottom: 12,
  },
  eventList: {
    marginBottom: 20,
    gap: 8,
  },
  eventOption: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  eventOptionSelected: {
    backgroundColor: '#8B1A1A',
    borderColor: '#8B1A1A',
  },
  eventOptionText: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '600',
  },
  eventOptionTextSelected: {
    color: '#FFFFFF',
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  map: {
    flex: 1,
  },
  warningBox: {
    backgroundColor: '#FEF9C3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  warningText: {
    color: '#A16207',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusBox: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  statusIdle: {
    backgroundColor: '#F3F4F6',
  },
  statusError: {
    backgroundColor: '#FEF2F2',
  },
  statusSuccess: {
    backgroundColor: '#ECFDF5',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusTextIdle: {
    color: '#4B5563',
  },
  statusTextError: {
    color: '#DC2626',
  },
  statusTextSuccess: {
    color: '#059669',
  },
  button: {
    backgroundColor: '#8B1A1A',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
