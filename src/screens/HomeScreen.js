import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Animated,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShoppingListItem from '../components/ShoppingListItem';
import { products } from '../data/products';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories] = useState(['All', 'Groceries', 'Electronics', "Men's Clothing", "Women's Clothing", 'HomeGoods', 'Beauty']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Animation states and refs
  const [animatingItem, setAnimatingItem] = useState(null);
  const animatedValue = useRef(new Animated.ValueXY()).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const startAddToCartAnimation = (item, event) => {
    // Set initial position of the animation
    animatedValue.setValue({ x: event.nativeEvent.pageX - 30, y: event.nativeEvent.pageY - 30 });
    fadeAnim.setValue(1);
    setAnimatingItem(item);

    // Get cart icon position (bottom right corner)
    const cartPosition = {
      x: width - 80,
      y: height - 100
    };

    // Start animation
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: { x: cartPosition.x, y: cartPosition.y },
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAnimatingItem(null);
      // Add item to cart after animation
      addToCart(item);
    });
  };

  const addToCart = (item) => {
    const existingItem = items.find(i => i.uniqueId === item.uniqueId);
    if (existingItem) {
      setItems(items.map(i => 
        i.uniqueId === item.uniqueId 
          ? { ...i, quantity: (i.quantity || 1) + 1 }
          : i
      ));
    } else {
      setItems([...items, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (uniqueId) => {
    const item = items.find(i => i.uniqueId === uniqueId);
    if (item.quantity > 1) {
      setItems(items.map(i => 
        i.uniqueId === uniqueId 
          ? { ...i, quantity: i.quantity - 1 }
          : i
      ));
    } else {
      setItems(items.filter(i => i.uniqueId !== uniqueId));
    }
  };

  const filteredProducts = () => {
    let result = [];
    if (selectedCategory === 'All') {
      Object.keys(products).forEach(category => {
        result = [...result, ...products[category].map(product => ({ 
          ...product, 
          category,
          uniqueId: `${category.toLowerCase()}_${product.id}` 
        }))];
      });
    } else if (selectedCategory === "Men's Clothing") {
      result = products.Clothing.filter(item => item.category === "Men's Clothing")
        .map(product => ({
          ...product,
          category: 'Clothing',
          uniqueId: `clothing_${product.id}`
        }));
    } else if (selectedCategory === "Women's Clothing") {
      result = products.Clothing.filter(item => item.category === "Women's Clothing")
        .map(product => ({
          ...product,
          category: 'Clothing',
          uniqueId: `clothing_${product.id}`
        }));
    } else {
      result = products[selectedCategory]?.map(product => ({ 
        ...product, 
        category: selectedCategory,
        uniqueId: `${selectedCategory.toLowerCase()}_${product.id}`
      })) || [];
    }

    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productItem}
      onPress={(event) => startAddToCartAnimation(item, event)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping List</Text>
        <Text style={styles.total}>Total: ${items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0).toFixed(2)}</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryItem,
              selectedCategory === item && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === item && styles.selectedCategoryText,
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item}
      />

      <FlatList
        data={filteredProducts()}
        renderItem={renderItem}
        keyExtractor={item => item.uniqueId}
        contentContainerStyle={styles.productsList}
        numColumns={2}
      />

      {/* Animation overlay */}
      {animatingItem && (
        <Animated.Image
          source={{ uri: animatingItem.image }}
          style={[
            styles.animatedImage,
            {
              transform: [
                { translateX: animatedValue.x },
                { translateY: animatedValue.y },
                { scale: fadeAnim },
              ],
              opacity: fadeAnim,
            },
          ]}
        />
      )}

      {/* Cart icon */}
      <TouchableOpacity 
        style={styles.cartContainer}
        onPress={() => setCartModalVisible(true)}
      >
        <MaterialIcons name="shopping-cart" size={30} color="#fff" />
        {items.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{items.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Cart Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={cartModalVisible}
        onRequestClose={() => setCartModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Cart</Text>
              <TouchableOpacity onPress={() => setCartModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {items.length > 0 ? (
              <>
                <FlatList
                  data={items}
                  renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                      <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                      <View style={styles.cartItemInfo}>
                        <Text style={styles.cartItemName}>{item.name}</Text>
                        <View style={styles.cartItemDetails}>
                          <Text style={styles.cartItemPrice}>${item.price}</Text>
                          <View style={styles.quantityContainer}>
                            <TouchableOpacity 
                              style={styles.quantityButton}
                              onPress={() => removeFromCart(item.uniqueId)}
                            >
                              <MaterialIcons name="remove" size={20} color="#6200ee" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>x{item.quantity || 1}</Text>
                            <TouchableOpacity 
                              style={styles.quantityButton}
                              onPress={() => addToCart(item)}
                            >
                              <MaterialIcons name="add" size={20} color="#6200ee" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                  keyExtractor={item => item.uniqueId}
                />
                <View style={styles.cartTotal}>
                  <Text style={styles.cartTotalText}>Total:</Text>
                  <Text style={styles.cartTotalAmount}>
                    ${items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0).toFixed(2)}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.buyButton}
                  onPress={() => {
                    setCartModalVisible(false);
                    navigation.navigate('Buy', {
                      items: items,
                      total: items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
                    });
                  }}
                >
                  <Text style={styles.buyButtonText}>Proceed to Checkout</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.emptyCart}>
                <MaterialIcons name="shopping-cart" size={64} color="#ccc" />
                <Text style={styles.emptyCartText}>Your cart is empty</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  total: {
    fontSize: 18,
    color: '#666',
  },
  searchInput: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoriesList: {
    maxHeight: 50,
    marginBottom: 10,
  },
  categoryItem: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCategory: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  categoryText: {
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  productsList: {
    padding: 10,
  },
  productItem: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  cartContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  animatedImage: {
    width: 60,
    height: 60,
    position: 'absolute',
    zIndex: 999,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cartItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 8,
  },
  quantityButton: {
    padding: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 8,
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: 5,
  },
  cartTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cartTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartTotalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  buyButton: {
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
