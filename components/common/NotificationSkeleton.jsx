import React from 'react';
import { View } from 'react-native';

const NotificationSkeleton = () => {
  return (
    <View className="p-4 bg-white mb-2 rounded-lg flex flex-row items-start animate-pulse">
      <View className="mr-4 bg-gray-300 h-12 w-12 rounded-md" />
      <View className="flex-1">
        <View className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
        <View className="h-4 bg-gray-300 rounded w-1/2" />
      </View>
    </View>
  );
};

export default NotificationSkeleton;
