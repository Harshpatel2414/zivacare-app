import React from 'react';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

const HomeLayout = () => {
  const { unreadCount} = useAuth();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'index':
              iconName = 'home';
              return <Ionicons name={iconName} size={size} color={color} />;
            case 'appointments':
              iconName = 'calendar-today';
              return <MaterialIcons name={iconName} size={size} color={color} />;
            case 'notifications':
              iconName = 'notifications';
              return <Ionicons name={iconName} size={size} color={color} />;
            case 'profile':
              iconName = 'user';
              return <FontAwesome5 name={iconName} size={size} color={color} />;
            default:
              return null;
          }
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          height: 60,
        },
        tabBarItemStyle: {
          backgroundColor: 'white',
          paddingVertical: 5,
        },
        tabBarActiveBackgroundColor: '#3b82f6',
      })}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home' }}
      />
      <Tabs.Screen
        name="appointments"
        options={{ title: 'Appointments' }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
           title: 'Notifications',
           tabBarBadge: unreadCount > 0 ? unreadCount : null,
          }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile' }}
      />
    </Tabs>
  );
};

export default HomeLayout;
