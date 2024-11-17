import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScheduleCard from '../../components/ScheduleCard';
import ScheduleSkeleton from '../../components/common/ScheduleSkeleton';
import appointmentService from '../firebase/appointment';
import { useAuth } from '../../context/AuthContext';
import { StatusBar } from 'expo-status-bar';

const ScheduleScreen = () => {
  const [selectedSchedule, setSelectedSchedule] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState({ upcoming: [], completed: [], canceled: [] });
  const { user } = useAuth()

  useEffect(() => {
    if (user?.userId) {

      const unsubscribe = appointmentService.listenToAppointments(user.userId, (appointments) => {
        setScheduleData(appointments);
        setLoading(false);
      });

      return () => {
        unsubscribe();
      }
    };
  }, [user]);

  const getBadgeCount = (type) => scheduleData[type]?.length || 0;

  return (
    <SafeAreaView className="flex-1 bg-blue-500">
      <StatusBar style="light" />
      <View className="bg-white scroll-smooth h-full">
        <View className="bg-blue-500 rounded-b-3xl py-2">
          <Text className="text-xl mx-4 font-semibold text-zinc-50 tracking-widest">Appointments</Text>
          <ScrollView horizontal className="mt-4 mx-4 h-12" showsHorizontalScrollIndicator={false}>
            {['upcoming', 'completed', 'canceled'].map((item, index) => (
              <TouchableOpacity key={index} onPress={() => setSelectedSchedule(item)} className="mr-4 h-10">
                <View className="relative">
                  <Text className={`px-3 text-sm capitalize py-2 rounded-2xl ${item === selectedSchedule
                      ? 'bg-zinc-50 font-semibold text-blue-600 border-b-2 border-zinc-300'
                      : 'bg-gray-200 text-gray-500'
                    }`}>
                    {item}  {getBadgeCount(item) > 0 && getBadgeCount(item)}
                  </Text>

                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {loading ? (
          <FlatList
            data={Array(4).fill(null)}
            keyExtractor={(item, index) => `skeleton-${index}`}
            renderItem={() => <ScheduleSkeleton />}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            className="h-full mt-2"
            showsVerticalScrollIndicator={false}
            data={scheduleData[selectedSchedule]}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => <ScheduleCard key={index} appointment={item} />}
            ListEmptyComponent={
              <View className="flex items-center justify-center h-[70vh]">
                <Text className="text-lg text-gray-500">No history</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ScheduleScreen;
