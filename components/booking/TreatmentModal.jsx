// components/Appointment/TreatmentModal.js

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  FlatList,
  Animated,
  Easing,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { treatmentsData } from '../../data/Treatments';

const TreatmentModal = ({
  visible,
  onClose,
  selectTreatment,
  treatment
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current; // Initial position off-screen

  useEffect(() => {
    if (visible) {
      // Slide in the modal when visible
      Animated.timing(slideAnim, {
        toValue: 0, // Move to the on-screen position
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      // Reset position for the next slide-in
      slideAnim.setValue(300);
    }
  }, [visible, slideAnim]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className={`flex-row items-center mb-4 p-2 border ${
        treatment === item.id
          ? 'border-blue-500'
          : 'border-gray-300'
      } rounded-lg`}
      onPress={() => selectTreatment(item.id)}
    >
      {/* Treatment Image */}
      <Image
        source={item.imageUrl}
        className="w-16 h-16 rounded-lg mr-4"
        resizeMode="cover"
      />
      <View>
        <Text
          className={`text-lg ${
            treatment === item.id ? 'text-blue-500' : 'text-black'
          }`}
        >
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="none" transparent>
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            width: '92%',
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 16,
          }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold text-blue-500">
              Select Treatment
            </Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Treatment List with Images */}
          <FlatList
            data={treatmentsData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

export default TreatmentModal;
