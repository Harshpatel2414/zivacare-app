import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

const Navbar = () => {
  return (
    <View className='bg-blue-500 rounded-br-3xl rounded-bl-3xl mb-10 z-20 '>
      <View className='flex flex-row justify-between px-4 items-center'>
        <View className="items-center flex-row pt-4 gap-2">
          <Image source={require('../../assets/success.png')} className="w-12 h-12 rounded-full bg-blue-100" resizeMode='cover' />
          <View className='flex'>
            <Text className="text-gray-200 text-sm">Hello,</Text>
            <Text className="text-zinc-50 text-lg font-semibold">John Doe</Text>
          </View>
        </View>
        <TouchableOpacity className='flex flex-row items-center gap-1'>
          <Text className='bg-blue-50 rounded-full text-center text-xm p-1 w-8 align-middle h-8'>2</Text>
          <FontAwesome name='bell' size={24} color='white' />
        </TouchableOpacity>
      </View>
      <View className='flex flex-row items-center w-[340px] justify-between mx-auto -bottom-5 border-2 border-blue-500 rounded-full px-3 bg-gray-50 drop-shadow-lg'>
        <AntDesign name="search1" size={24} color="#3b82f6" className="p-2 w-8 h-8 relative mr-2" />
        <TextInput className="p-2 w-full " placeholder="Search" />
      </View>
    </View>
  );
};

export default Navbar;
