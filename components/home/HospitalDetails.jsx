import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

const Hero = () => {
  const router = useRouter();
  const handleShedule = () => {
    router.push('/home/appointment-booking');
  };
  return (
    <View className="relative overflow-hidden z-10 py-5 px-4 md:py-24 bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white">
        <View className="flex flex-col-reverse gap-5 items-center">
          <View className="col-span-12 lg:col-span-7 xl:col-span-6 text-center lg:text-start lg:mb-0">
            <Text className="text-3xl font-bold leading-tight tracking-wide lg:text-7xl mb-4">
              Let's Reveal Something New!
            </Text>
            <Text className="text-lg opacity-80 mb-5">
              An activity that requires a person's mental or physical effort is work.
              If a person is trained for a certain type of job, they may have a job or profession which suits.
            </Text>
            <TouchableOpacity onPress={handleShedule} className="py-3 w-fit px-8 font-medium  bg-blue-500 hover:bg-opacity-90 rounded-full">
              <Text className='text-white text-center tracking-wide text-lg'>Schedule</Text>
            </TouchableOpacity>
          </View>
          <View className="relative text-center bg-blue-200 rounded-full object-center object-cover overflow-hidden">
            <Image
              resizeMode="cover"
              source={require('../../assets/success.png')}
              className="h-72 w-72 rounded-full mx-auto -translate-x-10"
            />
          </View>
      </View>
    </View>
  );
};

export default Hero;