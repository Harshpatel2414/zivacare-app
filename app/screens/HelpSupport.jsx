import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/common/Header';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function HelpSupport() {
  const [activeSection, setActiveSection] = useState(0);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <StatusBar style="dark" />
      <Header title="Help & Support" onBack={() => router.back()} />

      <ScrollView className="h-full pb-5" showsVerticalScrollIndicator={false}>
        {[
          { 
            title: 'Offers, Discounts & Coupons', 
            content: (
              <Text className="text-gray-600 text-base leading-6">
                We regularly offer discounts and promotions on skincare treatments. Check our app for the latest offers and apply available coupons at checkout to save on your appointments. Keep an eye on our promotions to get the best value for your skincare needs with <Text className="text-blue-500 font-semibold">JeevaCare</Text>.
              </Text>
            )
          },
          { 
            title: 'Manage Your Account', 
            content: (
              <Text className="text-gray-600 text-base leading-6">
                You can manage your account settings and preferences directly through the app. This includes updating your profile information, managing your appointment history, and adjusting your notification settings. If you need help with any account-related issues, contact our support team for assistance.
              </Text>
            )
          },
          { 
            title: 'Cancellation & Rescheduling', 
            content: (
              <>
                <Text className="text-gray-600 text-base leading-6 mb-4">
                  For <Text className="font-semibold">users</Text>: To cancel or reschedule your skincare treatment appointment, navigate to the "Appointments" tab in the app. Select the appointment you wish to cancel or reschedule, and follow the prompts to complete the process. Please note that cancellations or rescheduling should be done at least 24 hours before the scheduled appointment time to avoid any penalties.
                </Text>
                <Text className="text-gray-600 text-base leading-6 mb-4">
                  For <Text className="font-semibold">doctors/admins</Text>: Admins can schedule or reschedule appointments through the admin panel. The appointment status for a first-time booking will be set to "Pending" until an admin schedules it. Once scheduled, the status will be updated accordingly.
                </Text>
                <Text className="text-gray-600 text-base leading-6 mb-4">
                  If you have any issues with appointment management or need assistance, please contact our support team for help.
                </Text>
              </>
            )
          },
          { 
            title: 'Appointment Preparation & Aftercare', 
            content: (
              <>
                <Text className="text-gray-600 text-base leading-6 mb-4">
                  To ensure the best results from your skincare treatment, follow these guidelines:
                </Text>
                <Text className="text-lg font-semibold text-black mb-2">Preparation</Text>
                <Text className="text-gray-600 text-base leading-6 mb-4">
                  - Avoid using harsh skincare products or treatments that may irritate your skin before your appointment. Make sure to clean your face thoroughly before arriving. If you have any specific concerns or allergies, inform your skincare specialist beforehand.
                </Text>
                <Text className="text-lg font-semibold text-black mb-2">Aftercare</Text>
                <Text className="text-gray-600 text-base leading-6 mb-4">
                  - Follow the aftercare instructions provided by your skincare specialist. This may include avoiding direct sun exposure, using gentle skincare products, and staying hydrated. If you experience any unusual reactions or side effects, contact our support team for guidance.
                </Text>
                <Text className="text-gray-600 text-base leading-6">
                  Proper preparation and aftercare will help you get the most benefit from your skincare treatments with <Text className="text-blue-500 font-semibold">JeevaCare</Text>.
                </Text>
              </>
            )
          },
          { 
            title: 'Others', 
            content: (
              <Text className="text-gray-600 text-base leading-6">
                If you have any other questions or need further assistance, please reach out to our support team at <Text className="text-blue-500 font-semibold">support@zivacare.com</Text>. We are here to help you with any issues or inquiries you might have regarding your skincare treatments at <Text className="text-blue-500 font-semibold">JeevaCare</Text>.
              </Text>
            )
          },
        ].map((item, index) => (
          <View key={index} className="mt-4">
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
                {item.content}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
