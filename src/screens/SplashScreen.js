import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);
  const slideAnim = new Animated.Value(50);
  const bgScaleAnim = new Animated.Value(0);
  const thanksFadeAnim = new Animated.Value(0);
  const thanksScaleAnim = new Animated.Value(0.5);
  const decorScale1 = new Animated.Value(0);
  const decorScale2 = new Animated.Value(0);
  const decorRotate = new Animated.Value(0);

  useEffect(() => {
    // Initial animations
    Animated.sequence([
      // Background circle expansion
      Animated.timing(bgScaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.parallel([
        // Decorative elements animation
        Animated.timing(decorScale1, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(decorScale2, {
          toValue: 1,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(decorRotate, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        // Main content animations
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 10,
          friction: 2,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Thanks message animations
      Animated.parallel([
        Animated.timing(thanksFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(thanksScaleAnim, {
          toValue: 1,
          tension: 10,
          friction: 2,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Exit animations
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(thanksFadeAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(thanksScaleAnim, {
            toValue: 2,
            tension: 10,
            friction: 2,
            useNativeDriver: true,
          }),
          Animated.timing(bgScaleAnim, {
            toValue: 1.5,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start(onFinish);
      }, 2500);
    });
  }, []);

  const spin = decorRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const circleDiameter = Math.max(width, height) * 2;

  return (
    <View style={styles.container}>
      {/* Animated background circles */}
      <Animated.View
        style={[
          styles.bgCircle,
          {
            width: circleDiameter,
            height: circleDiameter,
            borderRadius: circleDiameter / 2,
            transform: [{ scale: bgScaleAnim }],
          },
        ]}
      />

      {/* Decorative elements */}
      <Animated.View
        style={[
          styles.decorCircle1,
          {
            transform: [
              { scale: decorScale1 },
              { rotate: spin },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.decorCircle2,
          {
            transform: [
              { scale: decorScale2 },
              { rotate: spin },
            ],
          },
        ]}
      />

      <View style={styles.content}>
        {/* Main content */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim }
              ],
            },
          ]}
        >
          <View style={styles.topDecor}>
            <MaterialIcons name="star" size={20} color="#fff" style={styles.decorStar} />
            <View style={styles.decorLine} />
            <MaterialIcons name="star" size={20} color="#fff" style={styles.decorStar} />
          </View>

          <View style={styles.iconContainer}>
            <MaterialIcons name="shopping-cart" size={80} color="#fff" style={styles.icon} />
            <View style={styles.iconOverlay} />
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.subtitle}>Welcome to</Text>
            <Text style={styles.name}>Ahmet Artun Bostan</Text>
            <Text style={styles.appName}>Shopping App</Text>
            <View style={styles.lineContainer}>
              <View style={[styles.line, styles.lineLeft]} />
              <MaterialIcons name="shopping-bag" size={24} color="#fff" style={styles.star} />
              <View style={[styles.line, styles.lineRight]} />
            </View>
          </View>
        </Animated.View>

        {/* Thanks message */}
        <Animated.View
          style={[
            styles.thanksContainer,
            {
              opacity: thanksFadeAnim,
              transform: [{ scale: thanksScaleAnim }],
            },
          ]}
        >
          <Text style={styles.thanksText}>
            Thank you Mrs. Aneta Narwojsz{'\n'}for everything you taught us this semester
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bgCircle: {
    position: 'absolute',
    backgroundColor: '#7722ff',
  },
  decorCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    top: '10%',
    right: -50,
  },
  decorCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    bottom: '20%',
    left: -30,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  topDecor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  decorLine: {
    width: 100,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 10,
  },
  decorStar: {
    opacity: 0.8,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.15, // Move content down
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 40,
    padding: 20,
  },
  icon: {
    zIndex: 2,
  },
  iconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 40,
    transform: [{ rotate: '45deg' }],
  },
  nameContainer: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 10,
    letterSpacing: 2,
  },
  name: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appName: {
    fontSize: 22,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 16,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
  },
  line: {
    height: 2,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  lineLeft: {
    marginRight: 15,
  },
  lineRight: {
    marginLeft: 15,
  },
  star: {
    opacity: 0.9,
  },
  thanksContainer: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    paddingHorizontal: 20,
  },
  thanksText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 28,
    letterSpacing: 0.5,
  },
});

export default SplashScreen;
