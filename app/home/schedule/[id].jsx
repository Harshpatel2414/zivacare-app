// ScheduleDetails.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/common/Header';
import appointmentService from '../../firebase/appointment';
import notificationService from '../../firebase/notification';
import Alert from '../../../components/common/Alert';
import { useAuth } from '../../../context/AuthContext';
import { StatusBar } from 'expo-status-bar';


const ScheduleDetails = () => {
    const { id } = useLocalSearchParams(); // Get the appointment ID from the URL
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [note, setNote] = useState('');
    const { user } = useAuth()
    const [cancelLoading, setCancelLoading] = useState(false);

    const router = useRouter(); // Hook to access navigation

    useEffect(() => {
        // Fetch appointment details using the ID (here using dummy data)
        const fetchedData = async () => {
            try {
                let data = await appointmentService.getAppointment(id)
                setAppointment(data);
            } catch (error) {
                console.log("Error fetching appointment details:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchedData()
    }, [id]);

    const handleCancel = async () => {
        setCancelLoading(true);
        try {
            await appointmentService.cancelAppointment(appointment.id, note);
            let notification = {
                title: 'Appointment Canceled',
                message: `Your appointment for ${appointment.treatmentName} has been canceled.`,
                type: 'cancel',
                createdAt: new Date().toISOString(),
                markAsRead: false,
            }

            await notificationService.addNotification(user.userId, notification)
            setModalVisible(true);
        } catch (error) {
            console.error('Error canceling appointment:', error);
        } finally {
            setCancelLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

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

    // Determine if the button should be disabled
    const isDisabled = ['completed', 'cancelled'].includes(appointment.status);

    return (
        <SafeAreaView className="flex-1 bg-white px-4">
            <StatusBar style="dark" />
            {/* Header */}
            <Header title="Schedule Details" onBack={() => router.back()} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                className='h-full'
            >

                {/* Doctor's Image */}
                <View className="items-center my-4">
                    <Image
                        source={{ uri: appointment.treatmentImage }}
                        className="w-32 h-32 rounded-lg bg-blue-100"
                        resizeMode="cover"
                    />
                    <Text className="text-2xl font-bold mt-2">{appointment.treatmentName}</Text>
                    <Text className="text-lg text-blue-400">{appointment.doctorName}</Text>
                </View>

                {/* Status */}
                <View className={`px-4 py-2 rounded-lg mx-auto ${statusColor} mb-4`}>
                    <Text className={"text-white text-sm font-semibold uppercase"}>
                        {appointment.status}
                    </Text>
                </View>

                {/* Details Section */}
                <View className="bg-white mt-4 rounded-lg shadow-sm">
                    <View className='flex flex-row justify-between py-2'>
                        <View className="flex-row items-center gap-2 ">
                            <FontAwesome name="calendar" size={20} color="#3b82f6" />
                            <Text className="text-gray-600 text-sm">{appointment.date}</Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <FontAwesome name="clock-o" size={20} color="#3b82f6" />
                            <Text className="text-gray-600 text-sm">{appointment.time}</Text>
                        </View>
                    </View>

                </View>

                {/* Treatment Details */}
                <View className="mt-4">
                    <Text className="text-gray-600 text-base">
                        Appointment Id : <Text className='text-blue-400 text-base'>{appointment.id}</Text>
                    </Text>
                </View>
                {/* Patient Details Card */}
                <Text className="text-lg font-semibold text-gray-700 my-3">Patient Details :</Text>
                <View className="bg-zinc-50 rounded-lg p-3">

                    <Text className="text-gray-500 text-base font-medium capitalize">Name : {appointment.patientName}</Text>
                    <Text className="text-gray-500 text-base font-medium">Mobile : {appointment.mobile}</Text>

                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-500 text-base font-medium">Gender : {appointment.gender}</Text>
                        <Text className="text-gray-500 text-base font-medium">Age : {appointment.age}</Text>
                    </View>
                    <Text className="text-gray-500 text-base font-medium capitalize">Address: {appointment.address}</Text>
                </View>
                {/* Admin Note */}
                {appointment.note && (
                    <View className="mt-4 bg-slate-100 p-3 rounded-lg mb-10">
                        <Text className="text-gray-800 text-base font-italic text-justify">
                            Note : <Text className='text-blue-400'>{appointment.note}</Text>
                        </Text>
                    </View>
                )}
            </ScrollView>
            {/* Button Section */}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCancel}
                disabled={isDisabled}
                className={`sticky bottom-5 w-full mx-auto py-2 rounded-lg ${isDisabled ? 'bg-gray-500' : 'bg-blue-500'} ${isDisabled ? 'opacity-50' : 'opacity-100'}`}
            >
                {cancelLoading ?
                    <Text className={`text-white text-center text-lg ${isDisabled ? 'font-semibold' : 'font-bold'}`}>
                        Canceling wait...
                    </Text>
                    :
                    <Text className={`text-white text-center text-lg ${isDisabled ? 'font-semibold' : 'font-bold'}`}>
                        {isDisabled ? 'Complete' : 'Cancel Appointment'}
                    </Text>
                }
            </TouchableOpacity>
            <Alert
                visible={modalVisible}
                title="Appointment Cancelled"
                message="Your appointment has been canceled successfully."
                onClose={() => router.back()}
                type="success"
            />

        </SafeAreaView>
    );
};

export default ScheduleDetails;