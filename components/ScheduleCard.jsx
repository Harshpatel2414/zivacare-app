import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';

const ScheduleCard = ({ appointment}) => {

  // Define colors for different statuses
  const statusColors = {
    pending: 'bg-purple-500',
    canceled: 'bg-red-500',
    scheduled: 'bg-teal-500',
    rescheduled: 'bg-orange-500',
    completed: 'bg-gray-400',
  };

  // Get the color class for the current status
  const statusColor = statusColors[appointment.status] || 'bg-gray-500';


  return (
    <View className="mx-4 my-2 p-4 bg-neutral-100 rounded-lg shadow-xl drop-shadow-lg relative overflow-hidden">
      {/* Status Pill */}
      <View className={`absolute top-0 right-0 px-3 py-1 rounded-bl-lg ${statusColor}`}>
        <Text className="text-white text-xs font-semibold capitalize">
          {appointment.status}
        </Text>
      </View>

      {/* Appointment Details */}
      <View className="flex-row items-center gap-4 mb-2">
        <Image
          source={{ uri: appointment?.treatmentImage }}
          className="w-12 h-12 rounded-lg bg-blue-100"
          resizeMode="cover"
        />
        <View>
          <Text className="text-lg font-bold">{appointment.treatmentName}</Text>
          <Text className="text-gray-500">{appointment.doctorName}</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between mt-2">
        <View className="flex-row items-center gap-2">
          <FontAwesome name="calendar" size={16} color="gray" />
          <Text className="text-gray-500">{appointment.date}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <FontAwesome name="clock-o" size={16} color="gray" />
          <Text className="text-gray-500">{appointment.time}</Text>
        </View>
      </View>

      <View className="flex flex-row gap-2 mt-4 ">
        <TouchableOpacity  activeOpacity={0.8} className="mt-4 flex-1 px-4 py-2 bg-blue-500 rounded-lg">
          <Link href={`/home/schedule/${appointment.id}`} asChild>
            <Text className="text-gray-100 tracking-wide text-center">Details</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScheduleCard;
