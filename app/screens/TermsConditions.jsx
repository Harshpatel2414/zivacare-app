import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/common/Header';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function TermsConditions() {
  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <StatusBar style="dark" />
      <Header title="Terms & Conditions" onBack={() => router.back()} />

      <ScrollView className="py-5" showsVerticalScrollIndicator={false}>
        <Text className="text-sm text-gray-500 mb-2">Last update: 25/6/2022</Text>
        <Text className="mb-4 text-base text-gray-700">
          Please read these terms of service carefully before using our app, <Text className="text-blue-500 font-semibold">JeevaCare</Text>, operated by us.
        </Text>
        <Text className="text-lg font-semibold text-black mb-2">Conditions of Use</Text>
        <Text className="text-gray-700 text-base leading-6">
          By accessing or using <Text className="text-blue-500 font-semibold">JeevaCare</Text>, you agree to comply with and be bound by the following terms and conditions. If you do not agree with these terms, please do not use our app.
        </Text>
        <Text className="text-lg font-semibold text-black mb-2 mt-4">User Responsibilities</Text>
        <Text className="text-gray-700 text-base leading-6">
          You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. Please notify us immediately of any unauthorized use of your account or any other breach of security.
        </Text>
        <Text className="text-lg font-semibold text-black mb-2 mt-4">Data Privacy</Text>
        <Text className="text-gray-700 text-base leading-6">
          Your privacy is important to us. By using <Text className="text-blue-500 font-semibold">JeevaCare</Text>, you consent to our collection, use, and sharing of your personal information as described in our Privacy Policy.
        </Text>
        <Text className="text-lg font-semibold text-black mb-2 mt-4">Changes to Terms</Text>
        <Text className="text-gray-700 text-base leading-6">
          We may update these terms from time to time. We will notify you of any changes by posting the new terms on this page. You are advised to review these terms periodically for any changes.
        </Text>
        <Text className="text-lg font-semibold text-black mb-2 mt-4">Contact Us</Text>
        <Text className="text-gray-700 text-base leading-6 mb-28">
          If you have any questions about these terms, please contact us at support@zivacare.com.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
