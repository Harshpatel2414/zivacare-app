import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Header({ title, onBack }) {
  return (
    <View className="flex flex-row items-center h-16 border-zinc-100 border-b-2">
      <TouchableOpacity onPress={onBack} className="bg-zinc-100 p-2 rounded-lg">
        <Ionicons name="arrow-back" size={24} color="gray" />
      </TouchableOpacity>
      <Text className="text-xl ml-4 text-blue-500 font-bold">{title}</Text>
    </View>
  );
}
