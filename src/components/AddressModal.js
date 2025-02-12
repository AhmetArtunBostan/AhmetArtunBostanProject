import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AddressModal = ({ visible, onClose, onSave }) => {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const handleSave = () => {
    onSave(address);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Delivery Address</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Street Address</Text>
              <TextInput
                style={styles.input}
                value={address.street}
                onChangeText={(text) => setAddress({ ...address, street: text })}
                placeholder="Enter street address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                value={address.city}
                onChangeText={(text) => setAddress({ ...address, city: text })}
                placeholder="Enter city"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                value={address.state}
                onChangeText={(text) => setAddress({ ...address, state: text })}
                placeholder="Enter state"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>ZIP Code</Text>
              <TextInput
                style={styles.input}
                value={address.zipCode}
                onChangeText={(text) => setAddress({ ...address, zipCode: text })}
                placeholder="Enter ZIP code"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Country</Text>
              <TextInput
                style={styles.input}
                value={address.country}
                onChangeText={(text) => setAddress({ ...address, country: text })}
                placeholder="Enter country"
              />
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Address</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '80%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddressModal;
