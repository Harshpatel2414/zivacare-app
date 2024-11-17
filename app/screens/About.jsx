import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/common/Header';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function About() {
  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <StatusBar style="dark" />
      <Header title="About JeevaCare" onBack={() => router.back()} />

      <ScrollView className="py-5" showsVerticalScrollIndicator={false}>
        <Text className="text-sm text-gray-500 mb-2">Last update: 16/8/2024</Text>
        <Text className="mb-4 text-base text-gray-700">
          Welcome to <Text className="text-blue-500 font-semibold">JeevaCare</Text>, your trusted partner in skincare and wellness. Our mission is to provide you with easy access to top-tier skincare treatments, personalized for your unique needs.
        </Text>

        <Text className="text-lg font-semibold text-black mb-2">Our Vision</Text>
        <Text className="text-gray-700 text-base leading-6">
          At <Text className="text-blue-500 font-semibold">JeevaCare</Text>, we envision a world where everyone has access to the best skincare treatments, guided by professionals, from the comfort of their home. We aim to empower our users with knowledge and resources to achieve healthier, radiant skin.
        </Text>

        <Text className="text-lg font-semibold text-black mb-2 mt-4">Our Services</Text>
        <Text className="text-gray-700 text-base leading-6">
          We offer a range of services tailored to meet your skincare goals, including consultations with experienced dermatologists, personalized treatment plans, and ongoing support. With <Text className="text-blue-500 font-semibold">JeevaCare</Text>, achieving your best skin has never been easier.
        </Text>

        <Text className="text-lg font-semibold text-black mb-2 mt-4">Why Choose Us</Text>
        <Text className="text-gray-700 text-base leading-6">
          Our platform is designed with you in mind. We prioritize user experience, convenience, and, most importantly, results. <Text className="text-blue-500 font-semibold">JeevaCare</Text> connects you with top-rated skincare professionals, ensuring you receive expert advice and treatments.
        </Text>

        <Text className="text-lg font-semibold text-black mb-2 mt-4">Our Team</Text>
        <Text className="text-gray-700 text-base leading-6">
          Our team consists of experienced dermatologists, skincare specialists, and tech enthusiasts dedicated to bringing you the best in skincare technology. We are passionate about helping you look and feel your best.
        </Text>

        <Text className="text-lg font-semibold text-black mb-2 mt-4">Contact Us</Text>
        <Text className="text-gray-700 text-base leading-6 mb-28">
          We are here to help you on your skincare journey. If you have any questions or need support, please reach out to us at support@zivacare.com.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
