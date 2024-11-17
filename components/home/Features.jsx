import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Features = () => {
  return (
    <SafeAreaView className="bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white flex-1 fixed">
      <ScrollView className="py-14 md:py-24">
        <View className="container mx-auto px-4 relative">
          <View className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center justify-between">
            <View className="lg:w-1/2 lg:col-start-8">
              <Image
                source={{ uri: 'https://cdn.easyfrontend.com/pictures/featured/featured_11.png' }}
                style={{ width: '100%', height: undefined, aspectRatio: 1 }}
                className="rounded mt-4"
              />
            </View>
            <View className="lg:w-1/2 text-center lg:text-left">
              <Text className="text-2xl text-center font-bold mb-6">
                Get Choose Your Lovely Products
              </Text>
              <Text className="text-lg text-center opacity-80 mb-2">
                It&apos;s easier to reach your savings goals when you have the right savings account. Take a look and find the right one for you!
              </Text>
              <TouchableOpacity className="bg-blue-500 hover:bg-opacity-90 transition py-3 px-8 font-normal mt-4 md:mt-12 flex flex-row items-center justify-center rounded-lg w-[200px] mx-auto">
                <Text className='text-white mr-4 text-lg'>Explore more</Text>
                <FontAwesome name="arrow-right" size={16} color="white" className="ml-1" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Features;
