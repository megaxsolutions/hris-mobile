import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, Circle, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { LocationService, LocationData } from '../services/locationService';
import attendanceService, { AssignedGeofence } from '../services/attendanceService';
import { GOOGLE_DIRECTIONS_API_KEY } from '../utils/environment';

type RouteCoordinate = {
  latitude: number;
  longitude: number;
};

interface DirectionsResponse {
  status: string;
  routes?: Array<{
    overview_polyline?: {
      points?: string;
    };
    legs?: Array<{
      distance?: { text?: string };
      duration?: { text?: string };
    }>;
  }>;
}

interface LocationMapProps {
  height?: number;
  onGeofenceStatusChange?: (isInside: boolean) => void;
}

export const LocationMap: React.FC<LocationMapProps> = ({
  height = 300,
  onGeofenceStatusChange,
}) => {
  const MIN_DELTA = 0.0015;
  const MAX_DELTA = 0.2;
  const [location, setLocation] = useState<LocationData | null>(null);
  const [assignedGeofence, setAssignedGeofence] = useState<AssignedGeofence | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinate[]>([]);
  const [routeDistance, setRouteDistance] = useState<string>('');
  const [routeDuration, setRouteDuration] = useState<string>('');
  const [mapRegion, setMapRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(true);
  const mapRef = useRef<MapView>(null);
  const watchIdRef = useRef<any>(null);
  const routeRequestInFlightRef = useRef(false);
  const lastRouteFetchRef = useRef(0);
  const trackingRef = useRef(tracking);
  const lastCenterMapRef = useRef(0);
  const lastRouteOriginRef = useRef<{ latitude: number; longitude: number } | null>(null);

  const calculateDistanceMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const earthRadius = 6371000;

    const deltaLat = toRadians(lat2 - lat1);
    const deltaLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
  };

  useEffect(() => {
    trackingRef.current = tracking;
  }, [tracking]);

  useEffect(() => {
    if (!location || !assignedGeofence) {
      return;
    }

    const distance = calculateDistanceMeters(
      location.latitude,
      location.longitude,
      Number(assignedGeofence.latitude),
      Number(assignedGeofence.longitude)
    );

    const isInside = distance <= Number(assignedGeofence.radius_meters);
    onGeofenceStatusChange?.(isInside);
  }, [location, assignedGeofence, onGeofenceStatusChange]);

  const decodePolyline = (encoded: string): RouteCoordinate[] => {
    const coordinates: RouteCoordinate[] = [];
    let index = 0;
    let latitude = 0;
    let longitude = 0;

    while (index < encoded.length) {
      let result = 0;
      let shift = 0;
      let byte;

      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      const deltaLatitude = result & 1 ? ~(result >> 1) : result >> 1;
      latitude += deltaLatitude;

      result = 0;
      shift = 0;

      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      const deltaLongitude = result & 1 ? ~(result >> 1) : result >> 1;
      longitude += deltaLongitude;

      coordinates.push({
        latitude: latitude / 1e5,
        longitude: longitude / 1e5,
      });
    }

    return coordinates;
  };

  useEffect(() => {
    const fetchRoadRoute = async () => {
      if (!location || !assignedGeofence) {
        setRouteCoordinates([]);
        setRouteDistance('');
        setRouteDuration('');
        return;
      }

      if (!GOOGLE_DIRECTIONS_API_KEY) {
        setRouteCoordinates([]);
        return;
      }

      const destination = {
        latitude: Number(assignedGeofence.latitude),
        longitude: Number(assignedGeofence.longitude),
      };

      const origin = {
        latitude: location.latitude,
        longitude: location.longitude,
      };

      const lastOrigin = lastRouteOriginRef.current;
      if (lastOrigin) {
        const movedMeters = calculateDistanceMeters(
          lastOrigin.latitude,
          lastOrigin.longitude,
          origin.latitude,
          origin.longitude
        );

        if (movedMeters < 75) {
          return;
        }
      }

      const now = Date.now();
      if (routeRequestInFlightRef.current || now - lastRouteFetchRef.current < 15000) {
        return;
      }

      routeRequestInFlightRef.current = true;
      lastRouteFetchRef.current = now;

      try {
        const originText = `${origin.latitude},${origin.longitude}`;
        const destinationText = `${destination.latitude},${destination.longitude}`;
        const directionsUrl =
          `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(originText)}` +
          `&destination=${encodeURIComponent(destinationText)}` +
          `&mode=driving&key=${encodeURIComponent(GOOGLE_DIRECTIONS_API_KEY)}`;

        const response = await fetch(directionsUrl);
        const data = (await response.json()) as DirectionsResponse;

        if (data.status !== 'OK' || !data.routes?.length) {
          setRouteCoordinates([]);
          setRouteDistance('');
          setRouteDuration('');
          return;
        }

        const route = data.routes[0];
        const encodedPoints = route.overview_polyline?.points || '';
        const coordinates = encodedPoints ? decodePolyline(encodedPoints) : [];

        setRouteCoordinates(coordinates);
        setRouteDistance(route.legs?.[0]?.distance?.text || '');
        setRouteDuration(route.legs?.[0]?.duration?.text || '');
        lastRouteOriginRef.current = origin;
      } catch (error) {
        console.error('Error fetching road route:', error);
        setRouteCoordinates([]);
        setRouteDistance('');
        setRouteDuration('');
      } finally {
        routeRequestInFlightRef.current = false;
      }
    };

    fetchRoadRoute();
  }, [location, assignedGeofence]);

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
        setMapRegion({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
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

          const now = Date.now();
          if (trackingRef.current && mapRef.current && now - lastCenterMapRef.current > 2500) {
            lastCenterMapRef.current = now;
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

  const applyZoom = (factor: number) => {
    if (!mapRegion || !mapRef.current) {
      return;
    }

    const nextLatitudeDelta = Math.max(
      MIN_DELTA,
      Math.min(MAX_DELTA, mapRegion.latitudeDelta * factor)
    );
    const nextLongitudeDelta = Math.max(
      MIN_DELTA,
      Math.min(MAX_DELTA, mapRegion.longitudeDelta * factor)
    );

    const nextRegion = {
      ...mapRegion,
      latitudeDelta: nextLatitudeDelta,
      longitudeDelta: nextLongitudeDelta,
    };

    setMapRegion(nextRegion);
    mapRef.current.animateToRegion(nextRegion, 250);
  };

  const zoomIn = () => applyZoom(0.6);
  const zoomOut = () => applyZoom(1.6);

  const openDirections = async () => {
    if (!location || !assignedGeofence) {
      return;
    }

    try {
      const origin = `${location.latitude},${location.longitude}`;
      const destination = `${Number(assignedGeofence.latitude)},${Number(assignedGeofence.longitude)}`;

      const nativeGoogleMapsUrl = `comgooglemaps://?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(destination)}&directionsmode=driving`;
      const webGoogleMapsUrl =
        `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}` +
        `&destination=${encodeURIComponent(destination)}&travelmode=driving`;

      const canOpenNative = await Linking.canOpenURL(nativeGoogleMapsUrl);
      if (canOpenNative) {
        await Linking.openURL(nativeGoogleMapsUrl);
        return;
      }

      await Linking.openURL(webGoogleMapsUrl);
    } catch (error) {
      console.error('Error opening directions:', error);
      Alert.alert('Navigation Error', 'Unable to open directions right now.');
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
        onRegionChangeComplete={(region) => {
          setMapRegion(region);
        }}
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

        {assignedGeofence && routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="rgba(0, 122, 255, 0.9)"
            strokeWidth={3}
            geodesic
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
        <TouchableOpacity style={styles.controlButton} onPress={zoomIn}>
          <MaterialIcons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={zoomOut}>
          <MaterialIcons name="remove" size={24} color="#007AFF" />
        </TouchableOpacity>

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
            {routeDistance ? <Text style={styles.infoText}>Route Distance: {routeDistance}</Text> : null}
            {routeDuration ? <Text style={styles.infoText}>Estimated Time: {routeDuration}</Text> : null}
            <TouchableOpacity style={styles.directionsButton} onPress={openDirections}>
              <MaterialIcons name="directions" size={18} color="#fff" />
              <Text style={styles.directionsButtonText}>Directions</Text>
            </TouchableOpacity>
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
  directionsButton: {
    marginTop: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  directionsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
  },
});
