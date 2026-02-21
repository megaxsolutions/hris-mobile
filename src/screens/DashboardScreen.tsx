import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { SwipeSlider } from '../components/SwipeSlider';
import { LocationMap } from '../components/LocationMap';
import dashboardService, { Bulletin } from '../services/dashboardService';
import { API_SERVER_URL } from '../utils/environment';

const IMAGE_URL = `${API_SERVER_URL}/uploads`;
const { width } = Dimensions.get('window');

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const getAllBulletins = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getAllBulletins();
      setBulletins(data.filter(bulletin => bulletin.file_name));
      //console.log('Fetched bulletins:', data);
    } catch (error) {
      console.error('Error fetching bulletins:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBulletins();
  }, []);

  // Auto-scroll slideshow
  useEffect(() => {
    if (bulletins.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bulletins.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [bulletins]);


  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        

        {/* Clock In/Out Slider */}
        <SwipeSlider onSuccess={() => getAllBulletins()} />

        {/* Location Map */}
        <LocationMap height={320} />

        {/* Quick Action Boxes */}
        <View style={styles.quickActionsContainer}>
        <TouchableOpacity
          style={styles.actionBox}
          onPress={() => navigation.navigate('Attendance')}
        >
          <MaterialIcons name="assignment" size={40} color="#007AFF" />
          <Text style={styles.actionLabel}>Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBox}
          onPress={() => navigation.navigate('Payslip')}
        >
          <MaterialIcons name="receipt" size={40} color="#34C759" />
          <Text style={styles.actionLabel}>Payslip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBox}
          onPress={() => navigation.navigate('LeaveRequest')}
        >
          <MaterialIcons name="calendar-today" size={40} color="#FF9500" />
          <Text style={styles.actionLabel}>Leave Request</Text>
        </TouchableOpacity>
      </View>

      {/* Bulletins Section */}
      <Text style={styles.sectionTitle}>Latest Updates</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : bulletins.length > 0 ? (
        <View style={styles.slideshowContainer}>
          {/* Slideshow */}
          <View style={styles.slideWrapper}>
            <Image
              source={{ uri: IMAGE_URL + '/' + bulletins[currentIndex].file_name }}
              style={styles.slideImage}
              resizeMode="cover"
            />
          </View>

          {/* Slide Counter and Title */}
          <View style={styles.slideInfo}>
            <Text style={styles.slideTitle}>
              {bulletins[currentIndex].title}
            </Text>
            <Text style={styles.slideCounter}>
              {currentIndex + 1} / {bulletins.length}
            </Text>
          </View>

          {/* Slide Description */}
          <ScrollView style={styles.descriptionContainer}>
            <Text style={styles.slideDescription}>
              {bulletins[currentIndex].content}
            </Text>
          </ScrollView>

          
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.placeholderText}>No bulletins available</Text>
        </View>
      )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  actionBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideshowContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  slideWrapper: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    backgroundColor: '#e0e0e0',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  slideInfo: {
    marginBottom: 12,
  },
  slideTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  slideCounter: {
    fontSize: 12,
    color: '#999',
  },
  descriptionContainer: {
    flex: 1,
    marginBottom: 15,
    maxHeight: 100,
  },
  slideDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007AFF',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
