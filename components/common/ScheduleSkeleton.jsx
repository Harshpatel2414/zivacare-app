import React from 'react';
import { View } from 'react-native';

const ScheduleSkeleton = () => {
  return (
    <View className="m-4 p-4 bg-gray-100 rounded-lg shadow-md animate-pulse">
      <View className="w-full h-6 bg-gray-300 rounded-md mb-2" />
      <View className="w-3/4 h-6 bg-gray-300 rounded-md mb-4" />
      <View className="flex flex-row justify-between">
        <View className="w-1/3 h-5 bg-gray-300 rounded-md" />
        <View className="w-1/3 h-5 bg-gray-300 rounded-md" />
      </View>
    </View>
  );
};

export default ScheduleSkeleton;
