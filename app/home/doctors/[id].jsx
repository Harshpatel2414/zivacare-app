import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import ReviewCard from "../../../components/ReviewCard";
import Header from "../../../components/common/Header";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { StatusBar } from "expo-status-bar";

const DoctorDetails = () => {
  const { id } = useLocalSearchParams();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reviewAdded, setReviewAdded] = useState(false);
  const router = useRouter();

  const fetchDoctorDetails = useCallback(() => {
    const doctorDocRef = doc(db, "doctors", id);

    const unsubscribe = onSnapshot(doctorDocRef, (doc) => {
      if (doc.exists()) {
        setDoctorDetails(doc.data());
      } else {
        setDoctorDetails(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching doctor details:", error);
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, [id]);

  useEffect(() => {
    const unsubscribe = fetchDoctorDetails();
    return () => unsubscribe();
  }, [fetchDoctorDetails]);

  useFocusEffect(
    useCallback(() => {
      if (reviewAdded) {
        setLoading(true);
        fetchDoctorDetails();
        setReviewAdded(false);  // Reset after refetch
      }
    }, [reviewAdded, fetchDoctorDetails])
  );

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const showPreviousImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex === 0 ? recent_works.length - 1 : prevIndex - 1));
  };

  const showNextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex === recent_works.length - 1 ? 0 : prevIndex + 1));
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size='large' color='#3b82f6' />
      </View>
    );
  }

  if (!doctorDetails) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>No doctor details available.</Text>
      </View>
    );
  }

  const {
    name,
    specialization,
    description,
    fees,
    aditional_info,
    recent_works,
    rating,
    reviews,
    imageUrl
  } = doctorDetails;

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <StatusBar style="dark" />
      <Header title={name} onBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="h-full flex-1 my-2 bg-white"
      >
        <View className="items-center py-2">
          <Image
            source={{ uri: imageUrl }}
            className="w-40 h-40 mb-4"
          />
          <Text className="text-lg text-gray-600 mt-2">{name}</Text>
          <Text className="text-base text-gray-400 mt-1">{specialization}</Text>
          <View className="flex-row items-center mt-2">
            <FontAwesome name="star" size={20} color="#FFD700" />
            <Text className="ml-2 text-lg text-blue-500 font-semibold">{rating}</Text>
            <Text className="ml-2 text-sm text-gray-500">/ 5.0</Text>
          </View>
        </View>

        <View className="bg-white py-5">
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity className="items-center bg-blue-500 px-2 py-4 w-20 rounded-lg">
              <Ionicons name="call" size={24} color="white" />
              <Text className="text-white mt-1 text-xs">Call</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center bg-blue-500 px-2 py-4 w-20 rounded-lg">
              <MaterialIcons name="message" size={24} color="white" />
              <Text className="text-white mt-1 text-xs">Message</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('https://goo.gl/maps/UfDfam5teaQduYhs7')} className="items-center bg-blue-500 px-2 py-4 w-20 rounded-lg">
              <Ionicons name="location" size={24} color="white" />
              <Text className="text-white mt-1 text-xs">Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center bg-blue-500 px-2 py-4 w-20 rounded-lg">
              <Ionicons name="share-social" size={24} color="white" />
              <Text className="text-white mt-1 text-xs">Share</Text>
            </TouchableOpacity>
          </View>

          <View className="py-2 rounded-lg shadow-sm bg-white">
            <Text className="text-lg font-bold text-[#5A2D2C] mb-2">Description</Text>
            <Text className="text-base text-gray-700">{description}</Text>
          </View>

          <View className="bg-white py-2 rounded-lg shadow-sm">
            <Text className="text-lg font-bold text-[#5A2D2C] mb-2">Fees</Text>
            <Text className="text-xl font-bold text-blue-500">Rs.{fees}</Text>
          </View>

          <View className="bg-white py-2 rounded-lg shadow-sm">
            <Text className="text-lg font-bold text-[#5A2D2C] mb-2">Additional Info</Text>
            <Text className="text-base text-gray-700">{aditional_info}</Text>
          </View>

          {recent_works && <View className="py-4 rounded-lg mb-4">
            <Text className="text-lg font-bold text-[#5A2D2C] mb-2">Recent Works</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recent_works.map((work, index) => (
                <TouchableOpacity key={index} onPress={() => openModal(index)}>
                  <Image
                    source={{ uri: work }}
                    className="w-28 h-28 rounded-lg mr-2 bg-blue-50"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>}

          <Modal visible={modalVisible} transparent={true} animationType="fade">
            <View style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} className="flex-1 justify-center items-center bg-black bg-opacity-75">
              <Image
                source={{ uri: recent_works[selectedImageIndex] }}
                className="w-80 h-80 bg-white rounded-lg"
              />
              <TouchableOpacity
                onPress={showPreviousImage}
                className="absolute left-4 top-1/2 -mt-12"
              >
                <Ionicons name="arrow-back-circle" size={50} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={showNextImage}
                className="absolute right-4 top-1/2 -mt-12"
              >
                <Ionicons name="arrow-forward-circle" size={50} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={closeModal}
                className="absolute top-8 right-8"
              >
                <Ionicons name="close-circle" size={50} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </Modal>

          <View className="bg-white py-2 mb-4 rounded-lg shadow-sm">
            <View className='flex flex-row items-center justify-between my-2'>
              <Text className="text-lg font-bold text-[#5A2D2C]">Reviews</Text>
              <TouchableOpacity
                className="p-2 rounded-lg flex-row items-center justify-center w-fit"
                onPress={() => router.push({
                  pathname: `/screens/DoctorReview`,
                  params: {
                    id: id,
                    name: name,
                    imageUrl: imageUrl,
                  }
                })}
              >
                <FontAwesome name="pencil" size={20} color="#3b82f6" />
                <Text className="text-blue-500 font-bold ml-2">Write a Review</Text>
              </TouchableOpacity>
            </View>
            {reviews?.length > 0 ? (
              reviews.map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))
            ) : (
              <Text className="text-md text-gray-700">No reviews yet.</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity onPress={() => router.push('home/BookAppointment')} className="bg-blue-500 p-4 mx-auto w-full rounded-lg flex-row items-center justify-center bottom-5 sticky">
        <FontAwesome name="calendar" size={20} color="#ffffff" />
        <Text className="text-white font-bold ml-2">Book Appointment</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DoctorDetails;
