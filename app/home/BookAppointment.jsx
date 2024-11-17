import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { doctorsData } from '../../data/Doctors';
import { treatmentData } from '../../data/Treatments';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import appointmentService from '../firebase/appointment';
import notificationService from '../firebase/notification';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/common/Alert'
import { StatusBar } from 'expo-status-bar';
// Helper function to get next 5 working days
const getNextWorkingDays = () => {
  const today = new Date();
  const workingDays = [];
  const maxDays = 6;

  let count = 0;
  while (count < maxDays) {
    if (today.getDay() !== 0) {
      // Exclude Sundays (0)
      const dateStr = today.toDateString().slice(0, 10);
      workingDays.push(dateStr);
      count++;
    }
    today.setDate(today.getDate() + 1);
  }

  return workingDays;
};
const times = [
  '08:00 - 9:00 AM',
  '09:00 - 10:00 AM',
  '10:00 - 11:00 AM',
  '01:00 - 02:00 PM',
  '02:00 - 3:00 PM',
  '03:00 - 4:00 PM',
];

const BookAppointment = () => {
  const { user } = useAuth()
  const [workingDays, setWorkingDays] = useState([]);
  const [availableSlots, setAvailableSlots] = useState(times);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    selectedDate: '',
    selectedTime: '',
    treatmentType: treatmentData[0] || {},
    selectedDoctor: doctorsData[0] || {},
    note: '',
    patientName: '',
    patientAge: '',
    patientGender: '',
    patientMobile: '',
    patientAddress: '',
  });

  // State for error flags
  const [errors, setErrors] = useState({
    date: false,
    time: false,
    treatment: false,
    doctor: false,
    name: false,
    age: false,
    gender: false,
    mobile: false,
    address: false,
  });

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData]);

  // Fetch booked slots when selectedDate changes
  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        if (formData.selectedDate) {
          const slots = await appointmentService.getBookedSlotsByDate(formData.selectedDate);
          setAvailableSlots(slots);
        }
      } catch (error) {
        console.error("Error fetching booked slots: ", error);
      }
    };

    fetchBookedSlots();
  }, [formData.selectedDate]);

  useEffect(() => {
    setWorkingDays(getNextWorkingDays());
    setFormData({ date: workingDays[0], ...formData })
  }, []);
  
  
  // Validation function
  const validateForm = () => {
    const newErrors = {
      date: !formData.selectedDate,
      time: !formData.selectedTime,
      treatment: !formData.treatmentType.id,
      doctor: !formData.selectedDoctor.id,
      name: !formData.patientName,
      age: !formData.patientAge,
      gender: !formData.patientGender,
      mobile: !formData.patientMobile,
      address: !formData.patientAddress,
    };

    setErrors(newErrors);

    return !Object.values(newErrors).includes(true);
  };

  // Handle booking logic
  const handleBookAppointment = async () => {
    setIsLoading(true)
    try {
      if (validateForm()) {
        let data = {
          userId: user.userId,
          patientName: formData.patientName,
          age: formData.patientAge,
          gender: formData.patientGender,
          mobile: formData.patientMobile,
          address: formData.patientAddress,
          doctorId: formData.selectedDoctor.id,
          treatmentId: formData.treatmentType.id,
          treatmentName: formData.treatmentType.name,
          treatmentImage: String(formData.treatmentType.imageUrl),
          doctorName: formData.selectedDoctor.name,
          date: formData.selectedDate,
          time: formData.selectedTime,
          notes: formData.note,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'pending',
        }

        await appointmentService.bookAppointment(data)
        let notification = {
          title: 'Appointment Booked',
          message: `Your appointment with ${formData.selectedDoctor.name} is booked on ${formData.selectedDate} at ${formData.selectedTime}`,
          markAsRead: false,
          createdAt: new Date().toISOString(),
          type: 'pending'
        }
        await notificationService.addNotification(user.userId, notification)
        setFormData({
          selectedDate: '',
          selectedTime: '',
          treatmentType: treatmentData[0] || {},
          selectedDoctor: doctorsData[0] || {},
          note: '',
          patientName: '',
          patientAge: '',
          patientGender: '',
          patientMobile: '',
          patientAddress: '',
        });
        setErrors({
          date: false,
          time: false,
          treatment: false,
          doctor: false,
          name: false,
          age: false,
          gender: false,
          mobile: false,
          address: false,
        }); // Clear errors
      }
    } catch (error) {
      console.log(error);

    } finally {
      setIsLoading(false)
      setShowAlert(true)
    }
  };

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    // Clear error for this field if it's not empty
    if (errors[field] && value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: false,
      }));
    }
  };

  return (
    <SafeAreaView className="bg-blue-500">
      <StatusBar style="light" />
      <Alert visible={showAlert} type='success' title='thank you' message="Appointment Booked Successfully" onClose={() => {
        setShowAlert(false)
        router.push('/(tabs)')
      }} />
      <View className="h-full px-4 bg-white">
        {/* Header */}
        <Header title="Book Appointment" onBack={() => router.back()} />

        <ScrollView showsVerticalScrollIndicator={false} className="py-2 mb-5">
          {/* Patient Details Section */}
          <View className="mt-5 mb-2">
            <Text className="text-base text-blue-500">Patient Name*</Text>
            <Input
              placeholder="Enter Full Name"
              value={formData.patientName}
              onChangeText={(text) => handleChange('patientName', text)}
              className={errors.name ? 'border-red-500' : ''}
            />
            <Text className="text-base text-blue-500">Age*</Text>
            <Input
              placeholder="Age"
              value={formData.patientAge}
              onChangeText={(text) => handleChange('patientAge', text)}
              className={errors.age ? 'border-red-500' : ''}
            />
            <Text className="text-base text-blue-500 mt-2">Gender*</Text>
            <View className="flex-row  mt-2">
              {['Male', 'Female', 'Other'].map((gender, index) => (
                <TouchableOpacity
                  key={index}
                  className={`flex-row items-center p-2`}
                  onPress={() => handleChange('patientGender', gender)}
                >
                  <Text
                    className={`mr-2 text-gray-700`}
                  >
                    {gender}
                  </Text>
                  <FontAwesome
                    name={formData.patientGender === gender ? 'dot-circle-o' : 'circle-o'}
                    size={20}
                    color={formData.patientGender === gender ? '#3b82f6' : 'gray'}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text className="text-base text-blue-500 mt-2">Mobile Number*</Text>
            <Input
              placeholder="Enter Number"
              value={formData.patientMobile}
              onChangeText={(text) => handleChange('patientMobile', text)}
              className={errors.mobile ? 'border-red-500' : ''}
            />
            <Text className="text-base text-blue-500 mt-2">Address*</Text>
            <Input
              placeholder="Enter full current address"
              multiline={3}
              value={formData.patientAddress}
              onChangeText={(text) => handleChange('patientAddress', text)}
              className={errors.address ? 'border-red-500' : ''}
            />
          </View>

          {/* Select Date Section */}
          <View className="mb-6">
            <Text
              className={`text-base mb-2 ${errors.date ? 'text-red-500' : 'text-blue-500'
                }`}
            >
              Select Date*
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {workingDays.map((date, index) => (
                <TouchableOpacity
                  key={index}
                  className={`p-3 rounded-lg mr-2 ${formData.selectedDate === date
                    ? 'bg-blue-500'
                    : 'bg-gray-100'
                    }`}
                  onPress={() => handleChange('selectedDate', date)}
                >
                  <Text
                    className={`${formData.selectedDate === date ? 'text-white' : 'text-gray-800'
                      }`}
                  >
                    {date}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Select Time Section */}
          <View className="mb-6">
            <Text
              className={`text-base mb-2 ${errors.time ? 'text-red-500' : 'text-blue-500'
                }`}
            >
              Available Time*
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {times.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  className={`p-3 rounded-lg mr-2 ${formData.selectedTime === time
                    ? 'bg-blue-500'
                    : 'bg-blue-100'
                    } ${availableSlots.includes(time) && "bg-gray-100"}`}
                  onPress={() => handleChange('selectedTime', time)}
                  disabled={availableSlots.includes(time)}
                >
                  <Text
                    className={`${formData.selectedTime === time ? 'text-white' : 'text-gray-800'
                      } ${availableSlots.includes(time) && "text-gray-400"}`}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Treatment Type Section */}
          <View className="mb-6">
            <Text
              className={`text-base mb-2 ${errors.treatment ? 'text-red-500' : 'text-blue-500'
                }`}
            >
              Treatment Type*
            </Text>
            <TouchableOpacity
              className="flex-row items-center p-3 bg-gray-100 rounded-lg"
              onPress={() => setShowTreatmentModal(true)}
            >
              <Image
                source={{ uri: formData.treatmentType.imageUrl }}
                className="w-10 h-10 rounded-full mr-2"
              />
              <Text className="flex-1 text-gray-800">
                {formData.treatmentType.name}
              </Text>
              <Ionicons name="chevron-down" size={24} color="gray" />
            </TouchableOpacity>
          </View>

          {/* Doctor Section */}
          <View className="mb-6">
            <Text
              className={`text-base mb-2 ${errors.doctor ? 'text-red-500' : 'text-blue-500'
                }`}
            >
              Doctor*
            </Text>
            <TouchableOpacity
              className="flex-row items-center p-3 bg-gray-100 rounded-lg"
              onPress={() => setShowDoctorModal(true)}
            >
              <Image
                source={{ uri: formData.selectedDoctor.imageUrl }}
                className="w-10 h-10 rounded-full mr-2"
              />
              <Text className="flex-1 text-gray-800">
                {formData.selectedDoctor.name}
              </Text>
              <Ionicons name="chevron-down" size={24} color="gray" />
            </TouchableOpacity>
          </View>

          {/* Notes Section */}
          <View className="mb-20">
            <Text className="text-base text-blue-500 mt-2">Note for Doctor</Text>
            <Input
              placeholder="Any specific requests or notes for the doctor"
              multiline={3}
              value={formData.note}
              onChangeText={(text) => handleChange('note', text)}
            />
          </View>

        </ScrollView>
        {/* Book Appointment Button */}
        <TouchableOpacity
          className={`py-3 ${isFormValid ? 'bg-blue-500' : 'bg-blue-400'} rounded-lg sticky bottom-5`}
          onPress={handleBookAppointment}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? <ActivityIndicator size={'small'} color={'white'} /> : <Text className="text-center text-white font-semibold tracking-widest">
            Submit
          </Text>}
        </TouchableOpacity>

        {/* Treatment Modal */}
        <Modal visible={showTreatmentModal} transparent={true} animationType='fade'>
          <View style={{ backgroundColor: 'rgba(0,0,1,0.5)' }} className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white p-5 rounded-lg w-11/12 max-h-4/5">
              <Text className="text-lg font-semibold mb-4 text-center text-blue-500">
                Select Treatment
              </Text>
              <ScrollView>
                {treatmentData.map((treatment,index) => (
                  <TouchableOpacity
                    key={index}
                    className="flex-row items-center p-3 bg-gray-100 rounded-lg mb-2"
                    onPress={() => {
                      handleChange('treatmentType', treatment);
                      setShowTreatmentModal(false);
                    }}
                  >
                    <Image
                      source={{ uri: treatment.imageUrl }}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <Text className="flex-1 text-gray-800">{treatment.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                className="mt-4 py-2 bg-blue-500 rounded-lg"
                onPress={() => setShowTreatmentModal(false)}
              >
                <Text className="text-center text-white font-semibold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Doctor Modal */}
        <Modal visible={showDoctorModal} transparent={true} animationType='fade'>
          <View style={{ backgroundColor: 'rgba(0,0,1,0.5)' }} className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white p-5 rounded-lg w-11/12 max-h-4/5">
              <Text className="text-lg font-semibold mb-4 text-center text-blue-500">
                Select Doctor
              </Text>
              <ScrollView>
                {doctorsData.map((doctor,index) => (
                  <TouchableOpacity
                    key={index}
                    className="flex-row items-center p-3 bg-gray-100 rounded-lg mb-2"
                    onPress={() => {
                      handleChange('selectedDoctor', doctor);
                      setShowDoctorModal(false);
                    }}
                  >
                    <Image
                      source={{ uri: doctor.imageUrl }}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <Text className="flex-1 text-gray-800">{doctor.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                className="mt-4 py-2 bg-blue-500 rounded-lg"
                onPress={() => setShowDoctorModal(false)}
              >
                <Text className="text-center text-white font-semibold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default BookAppointment;

