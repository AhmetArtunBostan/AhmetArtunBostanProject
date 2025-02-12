import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ShoppingListItem = ({ item, onToggle, onDelete }) => {
  const scaleValue = new Animated.Value(1);
  const opacityValue = new Animated.Value(1);

  useEffect(() => {
    if (item.completed) {
      Animated.timing(opacityValue, {
        toValue: 0.6,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [item.completed]);

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getCategoryColor = () => {
    switch (item.category) {
      case 'Groceries':
        return '#4caf50';
      case 'Electronics':
        return '#2196f3';
      case 'Clothing':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleValue }],
          opacity: opacityValue,
        },
      ]}
    >
      <View style={styles.itemContent}>
        <TouchableOpacity
          onPress={() => onToggle(item.id)}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={styles.checkbox}
        >
          <MaterialIcons
            name={item.completed ? 'check-box' : 'check-box-outline-blank'}
            size={24}
            color="#6200ee"
          />
        </TouchableOpacity>
        <View style={styles.itemDetails}>
          <Text style={[styles.itemName, item.completed && styles.completedText]}>
            {item.name}
          </Text>
          <View style={styles.itemInfo}>
            <Text style={styles.itemQuantityPrice}>
              {item.quantity} x ${item.price.toFixed(2)}
            </Text>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor() }]}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
          <Text style={styles.totalPrice}>
            Total: ${(item.quantity * item.price).toFixed(2)}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => onDelete(item.id)}
        style={styles.deleteButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialIcons name="delete-outline" size={24} color="#ff1744" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    marginRight: 12,
    padding: 4,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemQuantityPrice: {
    fontSize: 14,
    color: '#666666',
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6200ee',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888888',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 4,
    marginLeft: 12,
  },
});

export default ShoppingListItem;
