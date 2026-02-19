import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Text, Animated } from 'react-native';

export const SplashScreen: React.FC = () => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start rotation animation
    const rotation = Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 2000, // 2 seconds for full rotation
        useNativeDriver: true,
      })
    );

    rotation.start();

    // Cleanup
    return () => {
      rotation.stop();
    };
  }, [rotateValue]);

  const rotateDeg = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Rotating Logo */}
        <Animated.Image
          source={require('../../assets/images/mega.png')}
          style={[
            styles.logo,
            {
              transform: [{ rotate: rotateDeg }],
            },
          ]}
          resizeMode="contain"
        />
        
        {/* Loading Text */}
        <Text style={styles.appName}>MegaX Employee App</Text>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: '#999',
    letterSpacing: 1,
  },
});
