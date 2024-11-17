import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import authService from '../../appwrite/auth';
import userService from '../firebase/user';
import { useAuth } from '../../context/AuthContext';
import { StatusBar } from 'expo-status-bar';

const EnterMobileNumber = () => {
  const [step, setStep] = useState('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const { setUser } = useAuth();

  const otpInputRefs = useRef([]);

  // Handle sending OTP
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const fullPhoneNumber = `+91${mobileNumber}`;
      const token = await authService.mobileCreateAccount({ phone: fullPhoneNumber });
      setUserId(token.userId);
      setStep('otp');
      setResendEnabled(false);
      setTimer(60); // Reset the timer on sending a new OTP
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    setLoading(true);
    if (otpString.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      setError('');
      await authService.logout(); // Logout the user if already logged in
      const session = await authService.verifyOtp({ otp: otpString, userId });

      const isNewUser = await userService.isNewUser(userId);
      if (isNewUser) {
        router.push('/screens/BasicInfo');
      } else {
        const user = await userService.getUser(session.userId);
        setUser(user);
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.log('Error verifying OTP:', error);
      setError('The OTP entered is incorrect or expired.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (error) setError('');

    if (value && index < otp.length - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }

    if (!value && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Effect to handle automatic transition to OTP input and start the timer
  useEffect(() => {
    if (step === 'otp') {
      setOtp(['', '', '', '', '', '']); // Reset OTP on transition

      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            setResendEnabled(true); // Enable resend button when timer ends
            clearInterval(interval);
            return 0;
          }
        });
      }, 1000);

      return () => clearInterval(interval); // Clear interval on component unmount
    }
  }, [step]);

  return (
    <SafeAreaView className="flex-1 items-center bg-blue-500 relative">
      <StatusBar style="light" />
      <View className='h-fit w-full items-center mt-10'>
        <Image resizeMode='contain' source={require('../../assets/doc1.png')} className="w-full h-2/3 object-center object-cover" />
      </View>

      <View className='bg-white w-full p-10 pb-5 rounded-t-3xl absolute bottom-0'>
        {step === 'mobile' ? (
          <>
            <Text className="text-2xl text-center font-semibold mb-2 text-blue-500">Enter Your Phone Number</Text>
            <Text className="mb-4 text-center text-zinc-400">We will send a confirmation code.</Text>
            <View className="flex-row items-center w-full bg-gray-100 p-4 rounded-lg mb-4 border border-gray-300">
              <Text className="mr-2 text-gray-500 text-xl">+91</Text>
              <TextInput
                className="flex-1 bg-transparent text-xl tracking-widest"
                placeholder="1234567890"
                keyboardType="phone-pad"
                value={mobileNumber}
                onChangeText={setMobileNumber}
              />
            </View>
            <TouchableOpacity
              className="bg-blue-500 w-full p-4 rounded-lg"
              onPress={handleSendOtp}
              disabled={loading}
            >
              <Text className="text-white text-center font-semibold">{loading ? "Sending..." : "Send OTP"}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text className="text-2xl text-center font-semibold mb-2 text-blue-500">Verify Your Phone Number</Text>
            <Text className="text-base text-center mb-4 text-gray-500">Enter the 6-digit code sent to +91-{mobileNumber}. <Text onPress={() => setStep('mobile')} className='text-blue-500 pl-2 underline'>change</Text></Text>

            <View className="flex-row justify-between w-full mb-4">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (otpInputRefs.current[index] = ref)}
                  className={`w-12 h-12 bg-gray-100 text-center rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'
                    }`}
                  maxLength={1}
                  keyboardType="numeric"
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(event) => handleKeyPress(event, index)}
                />
              ))}
            </View>
            {error ? <Text className="text-red-500 text-sm mb-4">{error}</Text> : null}
            <TouchableOpacity
              className="bg-blue-500 w-full p-4 rounded-lg"
              onPress={handleVerifyOtp}
            >
              <Text className="text-white text-center font-semibold">{loading ? "Verifying..." : "Verify OTP"}</Text>
            </TouchableOpacity>

            {/* Timer and Resend OTP */}
            {timer > 0 ? (
              <Text className="text-center text-gray-500 mt-4">
                Resend OTP in {timer}s
              </Text>
            ) : (
              <TouchableOpacity
                onPress={handleSendOtp}
                disabled={!resendEnabled}
                className="mt-4"
              >
                <Text className={`text-center ${resendEnabled ? 'text-blue-500 underline' : 'text-gray-400'}`}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
        {/* Navigation to Privacy Policy and Terms & Conditions */}
        <Text className="text-center text-gray-500 mt-4">
          By continuing, you agree to our{" "}
          <Text onPress={() => router.push('screens/PrivacyPolicy')} className="text-blue-500 underline">
            Privacy Policy
          </Text>{" "}
          and{" "}
          <Text onPress={() => router.push('screens/TermsConditions')} className="text-blue-500 underline">
            Terms & Conditions
          </Text>.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default EnterMobileNumber;
