import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import authService from '../../appwrite/auth';
import appointmentService from '../../appwrite/appointment'
import userService from '../firebase/user';
import notificationService from '../firebase/notification';
import { useAuth } from '../../context/AuthContext';
import { StatusBar } from 'expo-status-bar';

const BasicInfo = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {setUser} = useAuth();
  const [errors, setErrors] = useState({});

  const handleImageSelect = async () => {
    setErrors((prev) => ({ ...prev, image: '' }));
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'You need to grant permission to access the photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      if (result.assets[0].fileSize <= 1000000) {
        const fileUri = result.assets[0].uri;
        setImageUri(fileUri);
        setFile(result.assets[0]);
      } else {
        setErrors((prev) => ({
          ...prev,
          image: 'Image size should be less than 1MB',
        }));
      }
    }
  };

  const handleSubmit = async () => {
    const validationErrors = {};

    if (!name) validationErrors.name = 'Name is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) validationErrors.email = 'Email is required';
    else if (!emailRegex.test(email)) validationErrors.email = 'Invalid email address';
    if (!age) validationErrors.age = 'Age is required';
    else if (isNaN(age) || age <= 0) validationErrors.age = 'Invalid age';
    if (!address) validationErrors.address = 'Address is required';
    if (!imageUri) validationErrors.image = 'Please select an image to upload';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const fileUploadResponse = await appointmentService.uploadFile(file);
      if (fileUploadResponse) {
        const preview = await appointmentService.getFilePreview(fileUploadResponse.$id);
        const currentUser = await authService.getCurrentUser();
        const newUser = {
          userId: currentUser.$id,
          mobile: currentUser.phone,
          email,
          name,
          gender,
          age,
          address,
          imageUrl: String(preview),
          termsConditionsAccepted:true,
          privacyPolicyAccepted:true
        };
        if (currentUser) {          
          await userService.saveUser(currentUser.$id, newUser);
          let notification = {
            title: 'WelCome to JeevaCare',
            message: 'Thank you for joining JeevaCare. We are excited to have you on board.',
            markAsRead: false,
            createdAt: new Date().toISOString(),
            type: 'bell'
          }
          await notificationService.addNotification(currentUser.$id, notification)
          const user = await userService.getUser(currentUser.$id);
          setUser(user);
          router.replace('/(tabs)');
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          image: 'Upload failed. Please try again.',
        }));
      }
    } catch (error) {
      console.error('Error saving user info:', error);
      setErrors((prev) => ({
        ...prev,
        form: 'An error occurred while saving your information.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      <StatusBar style="dark" />
      <Text className="text-xl font-semibold my-4 text-center">Basic Information</Text>
      <ScrollView
        className="w-full h-full mb-5"
        showsVerticalScrollIndicator={false}
      >
        <View className='flex items-center'>

          {/* Image Upload and Preview */}
          <TouchableOpacity
            onPress={handleImageSelect}
            className="mb-2 items-center"
          >
            <View className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 items-center justify-center">
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  className="w-full h-full"
                />
              ) : (
                <Text className="text-gray-600">Upload</Text>
              )}
            </View>
            {errors.image ? (
              <Text className="text-red-500 my-2">{errors.image}</Text>
            ) : <Text className='my-2 text-blue-500'>Select Profile</Text>}

          </TouchableOpacity>
        </View>

        <Text className="text-base text-blue-500 mb-2">Name :</Text>
        <TextInput
          className="w-full bg-gray-100 p-4 rounded-lg mb-1 border border-gray-300"
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
        />
        {errors.name && (
          <Text className="text-red-500 mb-2">{errors.name}</Text>
        )}

        <Text className="text-base text-blue-500 mb-2">Email :</Text>
        <TextInput
          className="w-full bg-gray-100 p-4 rounded-lg mb-1 border border-gray-300"
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {errors.email && (
          <Text className="text-red-500 mb-2">{errors.email}</Text>
        )}

        <Text className="text-base text-blue-500 mb-2">Gender :</Text>
        <View className="flex flex-row mb-4">
          <TouchableOpacity
            onPress={() => setGender('male')}
            className={`flex flex-row items-center mr-4 ${gender === 'male' ? 'text-blue-500' : 'text-gray-600'
              }`}
          >
            <View
              className={`w-5 h-5 rounded-full border-2 ${gender === 'male' ? 'border-blue-600' : 'border-gray-400'
                } flex items-center justify-center`}
            >
              {gender === 'male' && (
                <View className="w-3 h-3 bg-blue-500 rounded-full" />
              )}
            </View>
            <Text className="ml-2">Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setGender('female')}
            className={`flex flex-row items-center mr-4 ${gender === 'female' ? 'text-blue-500' : 'text-gray-600'
              }`}
          >
            <View
              className={`w-5 h-5 rounded-full border-2 ${gender === 'female' ? 'border-blue-600' : 'border-gray-400'
                } flex items-center justify-center`}
            >
              {gender === 'female' && (
                <View className="w-3 h-3 bg-blue-500 rounded-full" />
              )}
            </View>
            <Text className="ml-2">Female</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setGender('other')}
            className={`flex flex-row items-center ${gender === 'other' ? 'text-blue-500' : 'text-gray-600'
              }`}
          >
            <View
              className={`w-5 h-5 rounded-full border-2 ${gender === 'other' ? 'border-blue-600' : 'border-gray-400'
                } flex items-center justify-center`}
            >
              {gender === 'other' && (
                <View className="w-3 h-3 bg-blue-500 rounded-full" />
              )}
            </View>
            <Text className="ml-2">Other</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-base text-blue-500 mb-2">Age:</Text>
        <TextInput
          className="w-full bg-gray-100 p-4 rounded-lg mb-1 border border-gray-300"
          placeholder="Enter your age"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />
        {errors.age && (
          <Text className="text-red-500 mb-2">{errors.age}</Text>
        )}

        <Text className="text-base text-blue-500 mb-2">Address:</Text>
        <TextInput
          className="w-full bg-gray-100 p-4 rounded-lg mb-1 border border-gray-300"
          placeholder="Enter your address"
          numberOfLines={4}
          textAlignVertical="top"
          value={address}
          onChangeText={setAddress}
        />
        {errors.address && (
          <Text className="text-red-500 mb-2">{errors.address}</Text>
        )}
        {errors.form && (
          <Text className="text-red-500 mb-5">{errors.form}</Text>
        )}
      </ScrollView>
      <TouchableOpacity
        className="bg-blue-500 w-full p-4 rounded-lg sticky bottom-5 mx-auto"
        onPress={handleSubmit}
      >
        {isLoading ? <ActivityIndicator size={'small'} /> : <Text className="text-white text-sm text-center font-semibold">Submit</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default BasicInfo;
