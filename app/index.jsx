import React, { useRef, useState, useLayoutEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [onboardingChecked, setOnboardingChecked] = useState(false); 
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const { user, loading } = useAuth();

  useLayoutEffect(() => {
    const checkStatus = async () => {
      if (!loading) {
        const onboardingStatus = await AsyncStorage.getItem('onboardingCompleted');
        if (user) {
          router.replace('/(tabs)'); 
        } else if (onboardingStatus === 'true') {
          router.replace('/screens/EnterMobileNumber'); 
        } else {
          setOnboardingChecked(true); 
        }
      }
    };
    checkStatus();
  }, [user, loading]);

  const slides = [
    {
      key: '1',
      image: require('../assets/doc1.png'),
      title: 'Welcome to JeevaCare',
      description: 'Your health, our priority. Experience quality care and personalized treatment at your fingertips.',
    },
    {
      key: '2',
      image: require('../assets/doc1.png'),
      title: 'Book Appointments with Ease',
      description: 'Find the best doctors and schedule appointments with just a few taps. Healthcare made simple.',
    },
    {
      key: '3',
      image: require('../assets/doc1.png'),
      title: 'Access Personalized Care',
      description: 'Get customized treatment plans tailored to your needs. Your path to better health starts here.',
    },
  ];

  const handleCompleteOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      router.replace('/screens/EnterMobileNumber');
    } catch (error) {
      console.error('Error setting onboarding status:', error);
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToOffset({ offset: nextIndex * width, animated: true });
    } else {
      handleCompleteOnboarding();
    }
  };

  const handleSkip = () => {
    handleCompleteOnboarding();
  };

  const renderSlide = ({ item }) => (
    <View style={{ width, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
      <Image source={item.image} style={{ width: '80%', height: 300, resizeMode: 'contain', marginBottom: 20 }} />
      <Text className="text-2xl font-bold text-center text-blue-500 mb-2">{item.title}</Text>
      <Text className="text-sm text-center text-gray-600">{item.description}</Text>
    </View>
  );

  if (!onboardingChecked) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center">
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderSlide}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          const slideIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(slideIndex);
        }}
      />
      <View className="flex flex-row justify-center items-center mt-4">
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [1, 1.25, 1],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={{
                opacity,
                transform: [{ scale }],
                height: 8,
                width: 20,
                backgroundColor: '#3b82f6',
                margin: 8,
                borderRadius: 4,
              }}
            />
          );
        })}
      </View>
      <TouchableOpacity
        className="bg-blue-500 py-3 px-8 rounded-lg mt-4 mx-auto w-80"
        onPress={handleNext}
      >
        <Text className="text-white text-center font-semibold">
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-4 absolute top-16 right-5 bg-blue-50 py-2 px-3 rounded-full"
        onPress={handleSkip}
      >
        <Text className="text-blue-500">Skip</Text>
      </TouchableOpacity>
      <View className="flex-row justify-center items-center mt-4 mb-10">
        <Text className="text-gray-600">Have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/screens/EnterMobileNumber')}>
          <Text className="text-blue-500 font-bold">Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
