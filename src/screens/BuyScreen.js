import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AddressModal from '../components/AddressModal';
import PaymentModal from '../components/PaymentModal';
import OrderSuccessModal from '../components/OrderSuccessModal';

const BuyScreen = ({ route, navigation }) => {
  const { items, total } = route.params;
  const [address, setAddress] = useState(null);
  const [payment, setPayment] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePlaceOrder = () => {
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map(item => (
            <View key={item.uniqueId} style={styles.orderItem}>
              <View style={styles.orderItemLeft}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>x{item.quantity || 1}</Text>
              </View>
              <Text style={styles.itemPrice}>${(item.price * (item.quantity || 1)).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          {address ? (
            <View style={styles.savedAddress}>
              <Text style={styles.addressText}>
                {`${address.street}\n${address.city}, ${address.state} ${address.zipCode}\n${address.country}`}
              </Text>
              <TouchableOpacity onPress={() => setShowAddressModal(true)}>
                <MaterialIcons name="edit" size={24} color="#6200ee" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddressModal(true)}
            >
              <MaterialIcons name="add-location" size={24} color="#6200ee" />
              <Text style={styles.addButtonText}>Add Delivery Address</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {payment ? (
            <View style={styles.savedPayment}>
              <MaterialIcons name="credit-card" size={24} color="#6200ee" />
              <Text style={styles.paymentText}>
                {`•••• •••• •••• ${payment.cardNumber.slice(-4)}`}
              </Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(true)}>
                <MaterialIcons name="edit" size={24} color="#6200ee" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowPaymentModal(true)}
            >
              <MaterialIcons name="payment" size={24} color="#6200ee" />
              <Text style={styles.addButtonText}>Add Payment Method</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Delivery Fee</Text>
            <Text style={styles.totalValue}>$5.99</Text>
          </View>
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.grandTotal}>${(total + 5.99).toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.checkoutButton}
        onPress={handlePlaceOrder}
      >
        <Text style={styles.checkoutButtonText}>Place Order</Text>
      </TouchableOpacity>

      <AddressModal
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSave={(newAddress) => setAddress(newAddress)}
      />

      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSave={(newPayment) => setPayment(newPayment)}
      />

      <OrderSuccessModal
        visible={showSuccessModal}
        onClose={handleSuccessClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  orderItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    color: '#333',
  },
  itemQuantity: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  itemPrice: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#6200ee',
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    marginLeft: 8,
    color: '#6200ee',
    fontSize: 16,
  },
  savedAddress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginRight: 16,
  },
  savedPayment: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  totalSection: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
    marginBottom: 100,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalValue: {
    fontSize: 16,
    color: '#333',
  },
  finalTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  grandTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  checkoutButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#6200ee',
    padding: 20,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BuyScreen;
