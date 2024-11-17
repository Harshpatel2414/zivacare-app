import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Switch,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';
import userService from '../firebase/user';
import appointmentService from '../../appwrite/appointment';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const UpdateProfile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [imageUri, setImageUri] = useState(user.imageUrl);
  const [privacyPolicy, setPrivacyPolicy] = useState(user.privacyPolicyAccepted || false);
  const [termsConditions, setTermsConditions] = useState(user.termsConditionsAccepted || false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditingName, setIsEditingName] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const router = useRouter();

  // Monitor changes in any form field
  useEffect(() => {
    if (
      name !== user.name ||
      imageUri !== user.imageUrl ||
      privacyPolicy !== user.privacyPolicyAccepted ||
      termsConditions !== user.termsConditionsAccepted
    ) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [name, imageUri, privacyPolicy, termsConditions]);

  // Handle back button press on Android
  useEffect(() => {
    const handleBackPress = () => {
      if (hasUnsavedChanges) {
        Alert.alert(
          'Unsaved Changes',
          'You have unsaved changes. Do you want to discard them and leave?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Discard', onPress: () => router.back() },
          ],
          { cancelable: true }
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => backHandler.remove();
  }, [hasUnsavedChanges]);

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

    if (!name) {
      validationErrors.name = 'Name is required';
    }

    if (!imageUri) {
      validationErrors.image = 'Please select an image to upload';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      let imageUrl = user.imageUrl;
      if (imageUri && file) {
        const fileUploadResponse = await appointmentService.uploadFile(file);
        if (fileUploadResponse) {
          imageUrl = await appointmentService.getFilePreview(fileUploadResponse.$id);
        } else {
          setErrors((prev) => ({
            ...prev,
            image: 'Upload failed. Please try again.',
          }));
          return;
        }
      }

      const updatedUser = {
        ...(name !== user.name && { name }),
        ...(imageUri !== user.imageUrl && { imageUrl : String(imageUrl) }),
        ...(privacyPolicy !== user.privacyPolicyAccepted && { privacyPolicyAccepted: privacyPolicy }),
        ...(termsConditions !== user.termsConditionsAccepted && { termsConditionsAccepted: termsConditions }),
      };
   
      await userService.updateUser(user.userId, updatedUser);
      let updatedUserInfo = await userService.getUser(user.userId);
      setUser(updatedUserInfo);
      setHasUnsavedChanges(false);
      router.back();
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
      <Header title="Account Settings" onBack={() => router.back()} />
      <ScrollView className="w-full h-full my-5" showsVerticalScrollIndicator={false}>
        <View className="flex items-center">
          <TouchableOpacity onPress={handleImageSelect} className="mb-2 items-center">
            <View className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 items-center justify-center border-2 border-blue-500">
              {imageUri ? (
                <Image source={{ uri: imageUri }} className="w-full h-full" />
              ) : (
                <Text className="text-gray-600">Upload</Text>
              )}
            </View>
            {errors.image ? (
              <Text className="text-red-500 my-2">{errors.image}</Text>
            ) : (
              <Text className="my-2 text-blue-500">Change Profile</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex flex-row mb-4 items-center">
          <Text className="text-base text-gray-500 mr-3">Name :  <Text className="text-blue-500 capitalize">{name}</Text></Text>
          <TouchableOpacity onPress={() => setIsEditingName(!isEditingName)}>
            <Text className='underline'>edit</Text>
          </TouchableOpacity>
        </View>
        {isEditingName && (
          <TextInput
            className="w-full bg-gray-100 p-4 rounded-lg mb-1 border border-gray-300"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            onBlur={() => setIsEditingName(false)}
          />
        )}

        {errors.name && <Text className="text-red-500 mb-2">{errors.name}</Text>}

        {/* Privacy Policy */}
        <View className="flex flex-row justify-between items-center my-3">
          <Text className="text-base text-gray-500">Accept Privacy Policy</Text>
          <Switch
            value={privacyPolicy}
            thumbColor={'#3b82f6'}
            onValueChange={(value) => setPrivacyPolicy(value)}
          />
        </View>

        {/* Terms & Conditions */}
        <View className="flex flex-row justify-between items-center my-3">
          <Text className="text-base text-gray-500">Accept Terms & Conditions</Text>
          <Switch
            value={termsConditions}
            thumbColor={'#3b82f6'}
            onValueChange={(value) => setTermsConditions(value)}
          />
        </View>

        {errors.form && <Text className="text-red-500 mb-5">{errors.form}</Text>}
      </ScrollView>
      <TouchableOpacity
        className="bg-blue-500 w-full p-4 rounded-lg sticky bottom-5 mx-auto"
        onPress={handleSubmit}
      >
        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text className="text-white text-sm text-center font-semibold tracking-wider">
            Update
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default UpdateProfile;
