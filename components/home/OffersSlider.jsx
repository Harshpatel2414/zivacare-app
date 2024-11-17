// OffersSlider.js

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Animated, ScrollView, Dimensions } from 'react-native';

// Dummy offers data
const offers = [
  {
    title: 'Special Offers',
    description: 'Enjoy a 20% discount on facial treatments this month!',
    image: "https://cloud.appwrite.io/v1/storage/buckets/66a757960039921c5ff6/files/66bee87e0015886f6932/view?project=66a3e24e00284317aaa1&mode=admin",
  },
  {
    title: 'Summer Sale',
    description: 'Get 15% off on all spa packages this summer!',
    image: "https://cloud.appwrite.io/v1/storage/buckets/66a757960039921c5ff6/files/66bee8c3002b41090a55/view?project=66a3e24e00284317aaa1&mode=admin",
  },
  {
    title: 'Relaxation Week',
    description: 'Book a massage and receive a free aromatherapy session!',
    image: "https://cloud.appwrite.io/v1/storage/buckets/66a757960039921c5ff6/files/66bee8930037d017c830/view?project=66a3e24e00284317aaa1&mode=admin",
  },
];

const { width: screenWidth } = Dimensions.get('window');

const OffersSlider = () => {
  const scrollViewRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Animate scroll to the active slide
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: activeIndex * screenWidth, animated: true });
  }, [activeIndex]);

  // Handle manual slide control
  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setActiveIndex(index);
  };

  return (
    <View className="">
      <Text className="text-lg font-bold mx-5"># Offer for you</Text>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        ref={scrollViewRef}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        contentOffset={{ x: activeIndex * screenWidth, y: 0 }}
        scrollEnabled={true} // Allow manual scrolling
      >
        {offers.map((offer, index) => (
          <View key={index} className="w-full flex-row" style={{ width: screenWidth }}>
            <View className="bg-blue-50 rounded-lg overflow-hidden flex-row m-4 flex-1">
              <View className="w-2/3 p-4 bg-blue-50 bg-opacity-50">
                <Text className="text-lg font-bold text-blue-500">{offer.title}</Text>
                <Text className="text-sm text-gray-500">{offer.description}</Text>
              </View>
              <Image
                source={{uri : offer.image}}
                resizeMode="cover"
                className="w-1/3 h-full absolute top-0 right-0"
                style={{ zIndex: -10 }}
              />
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

export default OffersSlider;
