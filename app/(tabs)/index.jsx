import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import OffersSlider from '../../components/home/OffersSlider';
import AboutComponent from '../../components/home/About';
import doctorService from '../firebase/doctor';
import treatmentService from '../firebase/treatment';
import NotificationSkeleton from '../../components/common/NotificationSkeleton'
import { useAuth } from '../../context/AuthContext';
import { StatusBar } from 'expo-status-bar';

const HomeScreen = () => {
  const { user } = useAuth()
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tretmentData = await treatmentService.getTreatments();
        setTreatments(tretmentData);

        const unsubscribe = doctorService.getDoctors((docData) => {
          setDoctors(docData);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-blue-500">
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} className="h-full bg-white w-full">
        {/* Header */}
        <View className="flex-row justify-between items-center p-5 bg-blue-500 rounded-b-3xl pb-10">
          <View className='flex flex-row gap-2 items-center justify-between w-full'>
            <View>
              <Text className="text-lg font-semibold text-gray-100 capitalize">Hi, {user?.name}</Text>
              <Text className="text-sm text-gray-200">Welcome back!</Text>
            </View>
            <Image source={{ uri: user?.imageUrl }} className="w-12 h-12 rounded-full bg-blue-100 " />
          </View>
        </View>

        {/* Search Component */}
        <View className="flex flex-row items-center bg-gray-50 rounded-full p-3 -mt-7 border-blue-500 border-2 w-80 mx-auto">
          <FontAwesome name="search" size={20} color="#666" className="mr-3" />
          <TextInput
            cursorColor={'#3b82f6'}
            placeholder="Search treatments, doctors..."
            className="flex-1 text-base ml-2"
          />
        </View>

        {/* Hero Section */}
        <View className="items-center my-5">
          <Image
            source={require('../../assets/doc1.png')}
            className="w-52 h-52"
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold text-center text-blue-500 my-3">
            Welcome to JeevaCare
          </Text>
          <Text className="text-base text-center text-gray-600">
            Experience the best in skin care treatments with personalized care and
            top-notch professionals.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('home/BookAppointment')}
            activeOpacity={0.7}
            className='py-2 px-5 bg-blue-500 rounded-lg mt-3'>
            <Text className="text-zinc-50 text-base">Book Appointment</Text>
          </TouchableOpacity>
        </View>

        {/* Services Section */}
        <View className="my-5 px-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Our Services
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {loading ? [...Array(5)].map((_, index) => (
              <View key={index} className="items-center w-28 h-24 mr-2 bg-blue-50 p-3 rounded-lg" >
              </View>
            )) : treatments.map((service) => (
              <TouchableOpacity onPress={() => router.push(`home/treatments/${service.id}`)} activeOpacity={0.6} key={service.id} className="items-center w-28 mr-2 bg-blue-50 p-3 rounded-lg">
                <FontAwesome5 name={service.icon} size={32} color="#3b82f6" />
                <Text className="mt-2 text-sm text-gray-600">{service.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Offers Section */}
        <OffersSlider />

        {/* Doctors Section */}
        <View className="my-5 mx-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Meet Our Experts
          </Text>
          {loading
            ? <NotificationSkeleton />
            : (doctors.map((doctor) => (
              <TouchableOpacity key={doctor.id} activeOpacity={0.7} onPress={() => router.push(`/home/doctors/${doctor.id}`)}>
                <View
                  className="flex-row items-center mb-5 bg-blue-50 p-5 rounded-lg"
                >
                  <Image
                    source={{ uri: doctor.imageUrl }}
                    className="w-24 h-24 rounded-lg bg-zinc-50"
                  />
                  <View className="flex-1 ml-3">
                    <Text className="text-base font-bold text-gray-800">
                      {doctor.name}
                    </Text>
                    <Text className="text-sm text-gray-600">{doctor.specialization}</Text>
                    <View className="flex-row items-center mt-2">
                      <FontAwesome
                        name='star'
                        size={16}
                        color="#2563eb"
                      />
                      <Text className='ml-1'>{doctor.rating}</Text>
                      <Text className='text-gray-500 ml-2'>({doctor.review} reviews) </Text>
                    </View>
                  </View>

                </View>
              </TouchableOpacity>
            ))
            )}
        </View>

        {/* about */}
        <AboutComponent />

      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

