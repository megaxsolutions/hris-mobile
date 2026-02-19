import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LocationService, LocationData } from '../services/locationService';

interface LocationMapProps {
  height?: number;
}

export const LocationMap: React.FC<LocationMapProps> = ({ height = 300 }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      const hasPermission = await LocationService.requestForegroundPermissions();
      if (!hasPermission) {
        console.warn('Location permission not granted');
        setLoading(false);
        return;
      }

      const currentLocation = await LocationService.getCurrentLocation();
      if (currentLocation) {
        setLocation(currentLocation);
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    } finally {
      setLoading(false);
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

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  return (
    <View style={styles.mapWrapper}>
      {/* Map Container */}
      <View style={[styles.mapContainer, { height }]}>
        {/* Zoom Controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity 
            style={styles.zoomButton}
            onPress={handleZoomIn}
            activeOpacity={0.7}
          >
            <MaterialIcons name="add" size={24} color="#007AFF" />
          </TouchableOpacity>
          <View style={styles.zoomLevel}>
            <Text style={styles.zoomText}>{zoom.toFixed(1)}x</Text>
          </View>
          <TouchableOpacity 
            style={styles.zoomButton}
            onPress={handleZoomOut}
            activeOpacity={0.7}
          >
            <MaterialIcons name="remove" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Accuracy Circle */}
        {location.accuracy && (
          <View
            style={[
              styles.accuracyRing,
              {
                width: Math.min(location.accuracy * 1.2 * zoom, height * 0.7),
                height: Math.min(location.accuracy * 1.2 * zoom, height * 0.7),
              },
            ]}
          />
        )}

        {/* Location Marker */}
        <View style={[styles.markerContainer, { transform: [{ scale: zoom }] }]}>
          <View style={styles.markerOuter}>
            <View style={styles.markerMiddle}>
              <View style={styles.markerInner} />
            </View>
          </View>
          <Text style={styles.markerLabel}>📍 You</Text>
        </View>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <View style={styles.infoDot} />
          <Text style={styles.infoTitle}>Current Location</Text>
        </View>
        <Text style={styles.infoText}>Latitude: {location.latitude.toFixed(6)}</Text>
        <Text style={styles.infoText}>Longitude: {location.longitude.toFixed(6)}</Text>
        {location.accuracy && (
          <Text style={styles.infoText}>Accuracy: ±{location.accuracy.toFixed(1)}m</Text>
        )}
        {location.altitude && (
          <Text style={styles.infoText}>Altitude: {location.altitude.toFixed(1)}m</Text>
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
  zoomControls: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  zoomButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  zoomLevel: {
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
  },
  zoomText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  markerContainer: {
    alignItems: 'center',
    zIndex: 10,
  },
  markerOuter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  markerMiddle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#007AFF',
  },
  markerLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  accuracyRing: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: 'rgba(0, 122, 255, 0.3)',
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    zIndex: 5,
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
    backgroundColor: '#007AFF',
    marginRight: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
