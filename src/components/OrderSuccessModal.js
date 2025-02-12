import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const OrderSuccessModal = ({ visible, onClose }) => {
  const fireworkAnim1 = new Animated.Value(0);
  const fireworkAnim2 = new Animated.Value(0);
  const fireworkAnim3 = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      // Reset animations
      fireworkAnim1.setValue(0);
      fireworkAnim2.setValue(0);
      fireworkAnim3.setValue(0);
      scaleAnim.setValue(0);

      // Start animations
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 10,
          friction: 2,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(fireworkAnim1, {
            toValue: 1,
            duration: 1000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(fireworkAnim2, {
            toValue: 1,
            duration: 1000,
            delay: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(fireworkAnim3, {
            toValue: 1,
            duration: 1000,
            delay: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        setTimeout(onClose, 2000);
      });
    }
  }, [visible]);

  const getFireworkStyle = (anim) => ({
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -100],
        }),
      },
      {
        scale: anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.3, 1.2, 0],
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 0.2, 1],
      outputRange: [0, 1, 0],
    }),
  });

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <View style={styles.content}>
          <Animated.View style={[styles.successIcon, { transform: [{ scale: scaleAnim }] }]}>
            <MaterialIcons name="check-circle" size={64} color="#4CAF50" />
          </Animated.View>
          
          <Animated.View style={[styles.firework, styles.firework1, getFireworkStyle(fireworkAnim1)]}>
            <MaterialIcons name="star" size={24} color="#FFD700" />
          </Animated.View>
          <Animated.View style={[styles.firework, styles.firework2, getFireworkStyle(fireworkAnim2)]}>
            <MaterialIcons name="star" size={24} color="#FF6B6B" />
          </Animated.View>
          <Animated.View style={[styles.firework, styles.firework3, getFireworkStyle(fireworkAnim3)]}>
            <MaterialIcons name="star" size={24} color="#4CAF50" />
          </Animated.View>

          <Animated.Text style={[styles.title, { transform: [{ scale: scaleAnim }] }]}>
            Order Placed Successfully!
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, { transform: [{ scale: scaleAnim }] }]}>
            Thank you for your purchase
          </Animated.Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '80%',
  },
  successIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  firework: {
    position: 'absolute',
  },
  firework1: {
    top: '50%',
    left: '30%',
  },
  firework2: {
    top: '40%',
    right: '30%',
  },
  firework3: {
    top: '60%',
    left: '50%',
  },
});

export default OrderSuccessModal;
