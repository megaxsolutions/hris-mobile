import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { LocationService, LocationData } from '../services/locationService';
import attendanceService, { AssignedGeofence } from '../services/attendanceService';

interface LocationMapProps {
  height?: number;
}

export const LocationMap: React.FC<LocationMapProps> = ({ height = 300 }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [assignedGeofence, setAssignedGeofence] = useState<AssignedGeofence | null>(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(true);
  const mapRef = useRef<MapView>(null);
  const watchIdRef = useRef<any>(null);

  useEffect(() => {
    initializeLocation();
    return () => {
      stopTracking();
    };
  }, []);

  const initializeLocation = async () => {
    try {
      setLoading(true);
      const hasPermission = await LocationService.requestForegroundPermissions();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Location permission is required to track your movement');
        setLoading(false);
        return;
      }

      const currentLocation = await LocationService.getCurrentLocation();
      if (currentLocation) {
        setLocation(currentLocation);
        centerMap(currentLocation);
      }

      const geofence = await attendanceService.getMobileAssignedGeofence();
      setAssignedGeofence(geofence);

      // Start watching location changes
      startTracking();
    } catch (error) {
      console.error('Error initializing location:', error);
      Alert.alert('Location Error', 'Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  const startTracking = async () => {
    try {
      watchIdRef.current = await LocationService.watchPosition(
        (newLocation: LocationData) => {
          setLocation(newLocation);
          if (tracking && mapRef.current) {
            centerMap(newLocation);
          }
        },
        (error) => {
          console.error('Error watching position:', error);
        }
      );
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      LocationService.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const centerMap = (loc: LocationData) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: loc.latitude,
          longitude: loc.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    }
  };

  const toggleTracking = () => {
    setTracking(!tracking);
    if (!tracking && location) {
      centerMap(location);
    }
  };

  if (loading) {
    return (
      <View style={[styles.mapContainer, { height }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!location) {
    return (
      <View style={[styles.mapContainer, { height }, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>Unable to get location</Text>
      </View>
    );
  }

  return (
    <View style={styles.mapWrapper}>
      {/* Google Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={[styles.mapContainer, { height }]}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        zoomEnabled={true}
        scrollEnabled={true}
        rotateEnabled={false}
      >
        {assignedGeofence && (
          <Circle
            center={{
              latitude: Number(assignedGeofence.latitude),
              longitude: Number(assignedGeofence.longitude),
            }}
            radius={Number(assignedGeofence.radius_meters)}
            fillColor="rgba(255, 149, 0, 0.15)"
            strokeColor="rgba(255, 149, 0, 0.65)"
            strokeWidth={2}
          />
        )}

        {assignedGeofence && (
          <Marker
            coordinate={{
              latitude: Number(assignedGeofence.latitude),
              longitude: Number(assignedGeofence.longitude),
            }}
            title={assignedGeofence.name || 'Assigned Geofence'}
            description={`Lat: ${Number(assignedGeofence.latitude).toFixed(6)}, Lng: ${Number(assignedGeofence.longitude).toFixed(6)}`}
            pinColor="#FF9500"
          />
        )}

        {/* Accuracy Circle */}
        {location.accuracy && (
          <Circle
            center={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            radius={location.accuracy}
            fillColor="rgba(0, 122, 255, 0.1)"
            strokeColor="rgba(0, 122, 255, 0.3)"
            strokeWidth={2}
          />
        )}

        {/* User Location Marker */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You are here"
          description={`Accuracy: ±${location.accuracy?.toFixed(1) || '?'}m`}
          pinColor="#007AFF"
        />
      </MapView>

      {/* Control Buttons */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, !tracking && styles.controlButtonInactive]}
          onPress={toggleTracking}
        >
          <MaterialIcons
            name={tracking ? 'gps-fixed' : 'gps-not-fixed'}
            size={24}
            color={tracking ? '#007AFF' : '#999'}
          />
        </TouchableOpacity>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <View style={[styles.infoDot, tracking && styles.infoDotActive]} />
          <Text style={styles.infoTitle}>
            {tracking ? 'Live Tracking' : 'Location'}
          </Text>
          <Text style={[styles.trackingIndicator, tracking && styles.trackingActive]}>
            {tracking ? '●' : '○'}
          </Text>
        </View>
        <Text style={styles.infoText}>Latitude: {location.latitude.toFixed(6)}</Text>
        <Text style={styles.infoText}>Longitude: {location.longitude.toFixed(6)}</Text>
        {location.accuracy && (
          <Text style={styles.infoText}>Accuracy: ±{location.accuracy.toFixed(1)}m</Text>
        )}
        {location.altitude && (
          <Text style={styles.infoText}>Altitude: {location.altitude.toFixed(1)}m</Text>
        )}
        {assignedGeofence && (
          <>
            <Text style={styles.infoText}>Geofence: {assignedGeofence.name || 'Assigned'}</Text>
            <Text style={styles.infoText}>Geofence Latitude: {Number(assignedGeofence.latitude).toFixed(6)}</Text>
            <Text style={styles.infoText}>Geofence Longitude: {Number(assignedGeofence.longitude).toFixed(6)}</Text>
            <Text style={styles.infoText}>Geofence Radius: {Number(assignedGeofence.radius_meters).toFixed(0)}m</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapWrapper: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  mapContainer: {
    backgroundColor: '#e8f4f8',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#0099cc',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  controls: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 20,
    gap: 8,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  controlButtonInactive: {
    backgroundColor: '#f5f5f5',
  },
  infoCard: {
    backgroundColor: '#fff',
    marginTop: -16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999',
    marginRight: 8,
  },
  infoDotActive: {
    backgroundColor: '#34C759',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  trackingIndicator: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  trackingActive: {
    color: '#34C759',
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    fontFamily: 'monospace',
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
  },
});
