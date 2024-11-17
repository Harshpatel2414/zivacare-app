import React, { useState } from 'react';
import { Image, Text, View, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import authService from '../../appwrite/auth';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/common/Alert'
import { StatusBar } from 'expo-status-bar';

const Profile = () => {
  const router = useRouter();
  const {user,userLogout} = useAuth();
  const [scrollY] = useState(new Animated.Value(0));
  const[logoutAlert,setLogoutAlert] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    await userLogout();
    router.replace("/screens/EnterMobileNumber");
  };

  const handleLoginSignup = () => {
    router.replace('/screens/EnterMobileNumber');
  };

  const settingsOptions = [
    { title: 'Notifications', icon: 'bell', route: '/(tabs)/notifications' },
    { title: 'Privacy & Policy', icon: 'lock', route: '/screens/PrivacyPolicy' }
  ];

  const actionsOptions = [
    { title: 'Help & Support', icon: 'question-circle', route: '/screens/HelpSupport' },
    { title: 'Terms & Conditions', icon: 'file-contract', route: '/screens/TermsConditions' },
    { title: 'About', icon: 'info-circle', route: '/screens/About' }
  ];

  return (
    <SafeAreaView className="flex-1 bg-blue-500">
      <StatusBar style="light" />
      <Alert visible={logoutAlert} title="Logout"  message={`Are you sure you want to logout, ${user?.name}?`} onNo={()=>setLogoutAlert(false)} onYes={handleLogout}/>
      <Animated.ScrollView
        className='bg-white h-full'
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <Animated.View
          style={{
            transform: [{
              translateY: scrollY.interpolate({
                inputRange: [0, 200],
                outputRange: [0, -100],
                extrapolate: 'clamp'
              })
            }]
          }}
          className='bg-blue-500 rounded-bl-[40px] rounded-br-[40px] px-4 py-6'
        >
          <View className="flex items-center">
            <View className='border-2 bg-blue-100 border-blue-500 rounded-full w-24 h-24 object-cover object-center mb-2 relative'>
              <Image
                resizeMode='cover'
                source={{ uri: user?.imageUrl || 'default_image_url' }} // Use a default image URL
                className="w-full h-full rounded-full"
              />
              <TouchableOpacity className="absolute right-0 bottom-0 bg-gray-500 rounded-full p-2">
                <FontAwesome5 name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <View className='flex items-center justify-center'>
              <Text className="text-xl capitalize text-gray-50 font-bold mb-2 text-center">
                {user?.name || 'User Name'}
              </Text>
              <Text className="text-gray-300 mb-4 text-center">
                {user?.mobile || 'Email'}
              </Text>
            </View>
          </View>
        </Animated.View>

        <View className='mt-6 px-4 bg-white'>
          <>
            <Text className="text-lg font-bold mb-4">Settings</Text>
            {user && <TouchableOpacity
              className='flex flex-row items-center p-4 bg-zinc-50 rounded-lg shadow-sm mb-2'
              onPress={() => router.push('/auth/update-profile')}
            >
              <FontAwesome5 name='user-cog' size={20} color="#3b82f6" />
              <Text className="ml-4 text-lg">Account Settings</Text>
            </TouchableOpacity>}
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                className='flex flex-row items-center p-4 bg-zinc-50 rounded-lg shadow-sm mb-2'
                onPress={() => option.route && router.push(option.route)}
              >
                <FontAwesome5 name={option.icon} size={20} color="#3b82f6" />
                <Text className="ml-4 text-lg">{option.title}</Text>
              </TouchableOpacity>
            ))}
          </>
        </View>

        <View className='mt-6 px-4 pb-40'>
          <Text className="text-lg font-bold mb-4">{user ? 'Actions' : 'Welcome'}</Text>
          {actionsOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              className='flex flex-row items-center p-4 bg-zinc-50 rounded-lg shadow-sm mb-2'
              onPress={() => router.push(option.route)}
            >
              <FontAwesome5 name={option.icon} size={20} color="#3b82f6" />
              <Text className="ml-4 text-lg">{option.title}</Text>
            </TouchableOpacity>
          ))}
          {!user ? (
            <TouchableOpacity
              className='flex flex-row items-center p-4 bg-zinc-50 rounded-lg shadow-sm mb-2'
              onPress={handleLoginSignup}
            >
              <FontAwesome5 name='sign-in-alt' size={20} color="#3b82f6" />
              <Text className="ml-4 text-lg text-blue-500">Login</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className='flex flex-row items-center p-4 bg-zinc-50 rounded-lg shadow-sm mb-2'
              onPress={()=>setLogoutAlert(true)}
            >
              <FontAwesome5 name='sign-out-alt' size={20} color="#3b82f6" />
              <Text className="ml-4 text-lg text-red-500">Logout</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
