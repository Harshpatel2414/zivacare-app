import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const Button = ({ title, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} className="bg-blue-500 p-3 rounded-md items-center mt-2" onPress={onPress}>
      <Text className="text-white text-lg">{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
