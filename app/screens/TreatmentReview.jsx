import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Alert from '../../components/common/Alert';
import treatmentService from '../firebase/treatment';
import { useAuth } from '../../context/AuthContext';
import { StatusBar } from 'expo-status-bar';

const WriteReview = () => {
  const {user} =useAuth();
  const [review, setReview] = useState('');
  const [recommended, setRecommended] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const {name, imageUrl, id } =useLocalSearchParams()
  const handleSubmit = async () => {
    setLoading(true);
    let data = {
      userName : user.name,
      imageUrl: user.imageUrl,
      comment: review,
      recommended: recommended,
      rating: rating,
      date: new Date().toISOString(),
    }
    let response = await treatmentService.addReviewToTreatment(id,data);
    if(response.ok){
        setLoading(false);
        setShowAlert(true);
    }
  };

  const handleClose = () => {
    setShowAlert(false);
    router.back({
      reviewAdded: true,
    });
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <TouchableOpacity key={i} onPress={() => setRating(i)}>
            <Ionicons name="star" size={24} color="#2563eb" />
          </TouchableOpacity>
        );
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(
          <TouchableOpacity key={i} onPress={() => setRating(i)}>
            <Ionicons name="star-half" size={24} color="#2563eb" />
          </TouchableOpacity>
        );
      } else {
        stars.push(
          <TouchableOpacity key={i} onPress={() => setRating(i)}>
            <Ionicons name="star-outline" size={24} color="#2563eb" />
          </TouchableOpacity>
        );
      }
    }
    return stars;
  };

  return (
    <SafeAreaView className="flex-1 justify-between px-4 bg-white">
      <StatusBar style="dark" />
      <Alert visible={showAlert} type={'success'} onClose={handleClose} title={'thank you!'} message={'Review submitted successfully!'}/>
      <View className='flex flex-row gap-4 items-center h-20 border-b border-blue-50'>
        <TouchableOpacity onPress={() => router.back()} className="bg-blue-100 p-1 rounded-lg">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Write a Review</Text>
      </View>
      <ScrollView
        className="h-full mb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className='flex items-center justify-center gap-4 py-4'>
          <Image
            source={{ uri: imageUrl }}
            className="w-24 h-24 rounded-full bg-blue-100"
          />
          <View>
            <Text className="text-lg text-center text-blue-500">{name}</Text>
            <Text className="text-lg text-center mb-2">How was your experience</Text>
          </View>
          <View className="flex-row mb-4 gap-2">
            {renderStars()}
          </View>
        </View>

        <View className='w-full'>
          <Text className='text-lg mb-2'>Write Your Review</Text>
          <TextInput
            className="border border-gray-300 bg-gray-50 rounded p-2 w-full mb-4 text-start text-lg"
            placeholder="Write your experience"
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
          />
        </View>

        <Text className="text-lg mb-4">{`Would you recommend ${name} to your friends?`}</Text>

        <View className="flex-row w-full flex mb-4">
          <TouchableOpacity
            className="flex-row items-center mr-4"
            onPress={() => setRecommended(true)}
          >
            <Ionicons
              name={recommended === true ? "radio-button-on" : "radio-button-off"}
              size={24}
              color="#2563eb"
            />
            <Text className="text-lg ml-2">Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setRecommended(false)}
          >
            <Ionicons
              name={recommended === false ? "radio-button-on" : "radio-button-off"}
              size={24}
              color="#2563eb"
            />
            <Text className="text-lg ml-2">No</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        className="bg-blue-500 rounded py-2 w-full mx-auto sticky bottom-5"
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size='large' color="#FFFFFF" />
        ) : (
          <Text className="text-white text-lg text-center">Submit Review</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default WriteReview;
