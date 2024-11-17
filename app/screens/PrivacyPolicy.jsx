import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/common/Header';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState(0);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <StatusBar style="dark" />
      <Header title="Privacy Policy" onBack={() => router.back()} />

      <ScrollView className="py-5 h-full relative" showsVerticalScrollIndicator={false}>
        {[
          { 
            title: 'Personal Information Collection', 
            content: 'We collect personal information such as your name, contact details, and skincare preferences to provide you with tailored treatment plans and book your skincare appointments.'
          },
          { 
            title: 'Usage of Your Information', 
            content: 'Your data helps us to personalize your skincare experience, improve our services, and communicate with you about your appointments and treatment recommendations.'
          },
          { 
            title: 'Sharing Your Information', 
            content: 'We do not share your personal information with third parties unless it is necessary for processing your treatments or as required by law.'
          },
          { 
            title: 'Your Data Rights', 
            content: 'You have the right to access, modify, or delete your personal information. Please reach out to us if you wish to exercise these rights or need any assistance.'
          },
        ].map((item, index) => (
          <View key={index} className="mb-4">
            <TouchableOpacity
              onPress={() => toggleSection(index)}
              className={`flex-row justify-between items-center p-4 bg-zinc-50 rounded-lg shadow-sm ${activeSection === index ? 'bg-blue-50' : ''}`}
            >
              <Text className={`text-base font-semibold ${activeSection === index ? "text-blue-500" : "text-gray-800"}`}>{item.title}</Text>
              <MaterialIcons
                name={activeSection === index ? 'expand-less' : 'expand-more'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
            {activeSection === index && (
              <View className="p-4 bg-white border-t border-gray-200 rounded-lg">
                <Text className="text-gray-600 text-base">{item.content}</Text>
              </View>
            )}
          </View>
        ))}

      </ScrollView>
        <TouchableOpacity className="mt-6 w-full bg-blue-500 py-2 px-4 rounded-lg self-center sticky bottom-5">
          <Text className="text-white text-base text-center font-semibold">Contact Us</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}
