// AboutComponent.js

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ImageBackground, Linking } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

// Contact Information List
const contactInfoList = [
    {
        icon: "envelope",
        label: "email@zivacare.com",
        href: "mailto:email@zivacare.com",
    },
    {
        icon: "phone",
        label: "+91 1742-0****0",
        href: "tel:+88017420****0",
    },
    {
        icon: "globe",
        label: "zivica.com",
        href: "https://zivica-care.com",
    },
];

// Contact Form Component
const ContactForm = () => {
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value,
        });
    };

    const handleSubmit = () => {
        // Form validation logic
        if (formData.name && formData.email && formData.message) {
            console.log("Form submitted successfully!", formData);
            setFormData({
                name: "",
                email: "",
                message: "",
            })
            setValidated(true);
        } else {
            console.log("Please fill out all fields.");
            setValidated(false);
        }
    };

    return (
        <View className="bg-blue-100 p-5 rounded-xl shadow-sm">
            <Text className="text-2xl font-bold mb-4">Contact Us</Text>
            <Text className="text-lg mb-4">We list your menu online, help you process orders.</Text>

            <TextInput
                cursorColor={'#3b82f6'}
                className="bg-white p-3 rounded-lg mb-3 border border-gray-300"
                placeholder="Enter Name"
                value={formData.name}
                onChangeText={(text) => handleChange("name", text)}
            />

            <TextInput
                cursorColor={'#3b82f6'}
                className="bg-white p-3 rounded-lg mb-3 border border-gray-300"
                placeholder="Enter Email"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
            />

            <TextInput
                cursorColor={'#3b82f6'}
                className="bg-white p-3 rounded-lg mb-3 border border-gray-300"
                placeholder="Enter Message"
                value={formData.message}
                onChangeText={(text) => handleChange("message", text)}
                multiline
                numberOfLines={3}
            />

            <TouchableOpacity
                activeOpacity={0.7}
                className="bg-blue-500 p-4 rounded-lg"
                onPress={handleSubmit}
            >
                <Text className="text-white text-center font-semibold">Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

// Contact Information Component
const ContactInfo = ({ contactInfoList }) => (
    <View className="mt-5 absolute right-0">
        {contactInfoList.map((info, index) => (
            <TouchableOpacity
                activeOpacity={0.9}
                key={index}
                className="bg-blue-100 p-4 rounded-lg mb-4 shadow-sm flex-row items-center"
                onPress={() => Linking.openURL(info.href)}
            >
                <FontAwesome name={info.icon} size={24} color="#3b82f6" className="mr-4" />
                <Text className="text-lg ml-2">{info.label}</Text>
            </TouchableOpacity>
        ))}
    </View>
);

// Main About Component
const AboutComponent = () => {
    return (
        <ScrollView className="p-4 bg-white flex-1">
            <ImageBackground
                source={{ uri: "https://cdn.easyfrontend.com/pictures/contact/contact_7.png" }}
                className="w-80 h-64 mb-5 rounded-xl overflow-hidden"
                imageStyle={{ resizeMode: "cover" }}
            >
            </ImageBackground>

            <ContactInfo contactInfoList={contactInfoList} />
            {/* <ContactForm /> */}
        </ScrollView>
    );
};

export default AboutComponent;
