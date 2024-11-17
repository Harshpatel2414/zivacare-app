import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthContextProvider } from "../context/AuthContext";

const Layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthContextProvider>
          <Stack screenOptions={{
            headerShown: false,
          }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />

            <Stack.Screen
              name="auth/update-profile"
              options={{
                title: 'Update Profile'
              }}
            />
            <Stack.Screen
              name="screens/EnterMobileNumber"
              options={{
                title: 'Enter Mobile Number',
                animation: 'fade_from_bottom',
                presentation: 'formSheet'
              }}
            />

            {/* Home and Nested Routes */}
            <Stack.Screen
              name="(tabs)"
              options={{
                title: 'Home',
                headerShown: false,
                animation: 'ios'
              }}
            />
            <Stack.Screen
              name="home/BookAppointment"
              options={{
                headerShown: false,
                presentation: 'modal',
                animation: "ios"
              }}
            />
            {/* Dynamic Routes */}
            <Stack.Screen
              name="home/doctors/[id]"
              options={{
                title: 'Doctor Details'
              }}
            />
            <Stack.Screen
              name="home/schedule/[id]"
              options={{
                title: 'Schedule Details'
              }}
            />
            <Stack.Screen
              name="home/treatments/[id]"
              options={{
                title: 'Treatment Details',
                animation: 'ios',
                presentation: "formSheet"
              }}
            />
            <Stack.Screen
              name="screens/DoctorReview"
              options={{
                title: 'Write doctor Review',
                animation: 'ios',
                presentation: "formSheet"
              }}
            />
            <Stack.Screen
              name="screens/TreatmentReview"
              options={{
                title: 'Write treatment Review',
                animation: 'ios',
                presentation: "formSheet"
              }}
            />
            <Stack.Screen
              name="screens/PrivacyPolicy"
              options={{
                title: 'Privacy Policy',
                animation: 'ios',
                presentation: "formSheet"
              }}
            />
            <Stack.Screen
              name="screens/TermsConditions"
              options={{
                title: 'Privacy Policy',
                animation: 'ios',
                presentation: "formSheet"
              }}
            />
            <Stack.Screen
              name="screens/HelpSupport"
              options={{
                title: 'Privacy Policy',
                animation: 'ios',
                presentation: "formSheet"
              }}
            />
            <Stack.Screen
              name="screens/About"
              options={{
                title: 'About JeevaCare',
                animation: 'ios',
                presentation: "formSheet"
              }}
            />

          </Stack>
        </AuthContextProvider>
    </GestureHandlerRootView>
  );
};

export default Layout;
