import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Modal } from "react-native";
import { useLocalSearchParams, useFocusEffect, router } from "expo-router";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/common/Header";
import ReviewCard from "../../../components/ReviewCard";
import { onSnapshot, doc } from "firebase/firestore"; // Import Firestore methods
import { db } from "../../firebase/firebase";
import { StatusBar } from "expo-status-bar";

const TreatmentDetails = () => {
  const { id, reviewAdded } = useLocalSearchParams();
  const [treatmentDetails, setTreatmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const treatmentDocRef = doc(db, "treatments", id);
    
    const unsubscribe = onSnapshot(treatmentDocRef, (doc) => {
      if (doc.exists()) {
        setTreatmentDetails(doc.data());        
      } else {
        setTreatmentDetails(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching service details:", error);
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      if (reviewAdded) {
        setLoading(true);
        const treatmentDocRef = doc(firestore, "treatments", id);
        
        const unsubscribe = onSnapshot(treatmentDocRef, (doc) => {
          if (doc.exists()) {
            setTreatmentDetails(doc.data());
          } else {
            setTreatmentDetails(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching service details:", error);
          setLoading(false);
        });

        return () => unsubscribe(); // Clean up the listener on unmount
      }
    }, [reviewAdded, id])
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
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!treatmentDetails) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg font-bold">Treatment details not available</Text>
      </View>
    );
  }

  const {
    name,
    description,
    fees,
    additionalInfo,
    recent_works,
    rating,
    imageUrl,
    reviews,
  } = treatmentDetails;

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <StatusBar style="dark" />
      <Header title={name} onBack={() => router.back()} />
      <ScrollView className="h-full bg-white" showsVerticalScrollIndicator={false}>
        <View className="items-center my-4 relative">
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-60 mb-4 bg-blue-100 rounded-lg"
          />
          <View className="flex-row items-center bg-blue-50 px-2 py-1 rounded-lg absolute bottom-6 right-2">
            <FontAwesome name="star" size={20} color="#FFD700" />
            <Text className="ml-1 text-lg text-blue-500 font-semibold">
              {rating}
            </Text>
            <Text className="mx-1 text-sm text-gray-500">/ 5</Text>
          </View>
        </View>
        <View className="bg-white pb-2">
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity className="items-center bg-blue-500 px-2 py-4 w-20 rounded-lg">
              <Ionicons name="call" size={24} color="white" />
              <Text className="text-white mt-1 text-xs">Call</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center bg-blue-500 px-2 py-4 w-20 rounded-lg">
              <MaterialIcons name="message" size={24} color="white" />
              <Text className="text-white mt-1 text-xs">Message</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center bg-blue-500 px-2 py-4 w-20 rounded-lg">
              <Ionicons name="location" size={24} color="white" />
              <Text className="text-white mt-1 text-xs">Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center bg-blue-500 shadow-xl px-2 py-4 w-20 rounded-lg">
              <Ionicons name="share-social" size={24} color="white" />
              <Text className="text-white mt-1 text-xs">Share</Text>
            </TouchableOpacity>
          </View>

          <View className="rounded-lg shadow-sm mb-4 bg-white">
            <Text className="text-lg font-bold text-blue-500 mb-2">Description</Text>
            <Text className="text-base text-gray-700">{description}</Text>
          </View>

          <View className="bg-white rounded-lg shadow-sm mb-4">
            <Text className="text-lg font-bold text-blue-500 mb-2">Fees</Text>
            <Text className="text-xl font-bold text-gray-600 tracking-widest">Rs.{fees}</Text>
          </View>

          <View className="bg-white rounded-lg shadow-sm mb-4">
            <Text className="text-lg font-bold text-blue-500 mb-2">Additional Info</Text>
            <Text className="text-base text-gray-700">{additionalInfo}</Text>
          </View>

          <View className="py-4 rounded-lg mb-4">
            <Text className="text-lg font-bold text-blue-500 mb-2">Recent Works</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recent_works.length > 0 ? recent_works.map((work, index) => (
                <TouchableOpacity key={index} onPress={() => openModal(index)}>
                  <Image
                    source={{ uri: work }}
                    className="w-28 h-28 rounded-lg mr-2 bg-blue-50"
                  />
                </TouchableOpacity>
              )) : (<Text className="text-md text-gray-700">No recent works available.</Text>)}
            </ScrollView>
          </View>

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


          {/* Reviews Section */}
          <View className="bg-white py-4 rounded-lg shadow-sm mb-4">
            <View className='flex flex-row items-center justify-between my-2'>
              <Text className="text-lg font-bold text-[#5A2D2C]">Reviews</Text>
              <TouchableOpacity
                className="p-2 rounded-lg flex-row items-center justify-center w-fit"
                onPress={() => router.push({
                  pathname: `/screens/TreatmentReview`,
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
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))
            ) : (
              <Text className="text-md text-gray-700">No reviews yet.</Text>
            )}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={() => router.push('home/BookAppointment')} className="bg-blue-500 p-4 mx-auto rounded-lg flex-row items-center justify-center bottom-5 w-full sticky">
        <FontAwesome name="calendar" size={20} color="#ffffff" />
        <Text className="text-white font-bold ml-2">Book Appointment</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TreatmentDetails;
