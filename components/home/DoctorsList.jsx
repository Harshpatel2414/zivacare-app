import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { doctors } from '../../data/Doctors'; // Assuming you have this data
import { useRouter } from 'expo-router';

const DoctorsList = () => {
  const router = useRouter();

  return (
    <View className="p-4">
      <Text className="text-lg font-bold mb-2">Available Doctors</Text>
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="p-2 bg-white drop-shadow-md rounded-md mb-2"
            onPress={() => router.push(`/home/doctors/${item.id}`)}
          >
            <Text className="text-lg font-semibold text-gray-700">{item.name}</Text>
            <Text className='text-gray-500'>Specialization : {item.specialization}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default DoctorsList;
