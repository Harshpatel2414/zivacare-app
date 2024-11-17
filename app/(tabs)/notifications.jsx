import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationSkeleton from '../../components/common/NotificationSkeleton';
import { Swipeable } from 'react-native-gesture-handler';
import notificationService from '../firebase/notification';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/common/Alert';
import { StatusBar } from 'expo-status-bar';

const Notifications = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const swipeableRefs = useRef({});
  const { notifications, unreadCount, user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead(user.userId);
    Object.values(swipeableRefs.current).forEach(ref => ref && ref.close());
  };

  const handleMarkAsRead = async (id) => {
    if (swipeableRefs.current[id]) {
      swipeableRefs.current[id].close();
    }
    await notificationService.markAsRead(user.userId, id);
  };

  const handleDeleteNotification = async (id) => {
    try {
      if (swipeableRefs.current[id]) {
        swipeableRefs.current[id].close();
      }
      await notificationService.deleteNotification(user.userId, id);
    } catch (error) {
      console.error("Error deleting notification: ", error);
    }
  };

  const renderRightActions = (id, markAsRead) => {
    if (!markAsRead) {
      return (
        <TouchableOpacity onPress={() => handleMarkAsRead(id)} className="bg-blue-500 justify-center items-center w-24 rounded-lg mt-2 -ml-2">
          <Text className="text-white font-bold p-4">Mark Read</Text>
        </TouchableOpacity>
      );
    }
    return null; // No swipe action if the notification is already read
  };

  const renderLeftActions = (id) => (
    <TouchableOpacity onPress={() => handleDeleteNotification(id)} className="bg-red-500 justify-center items-center w-24 rounded-lg mt-2 -mr-2">
      <Text className="text-white font-bold p-4">Delete</Text>
    </TouchableOpacity>
  );

  const formatTimeAgo = (timestamp) => {
    const now = currentTime;
    const createdAt = new Date(timestamp);
    const diff = now - createdAt;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'Just now';
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-500">
      <StatusBar style="light" />
      <View className="h-full bg-white">
        <View className="flex-row border-b-2 border-zinc-100 bg-blue-500 rounded-b-3xl h-20 items-center px-4 justify-between">
          <Text className="text-xl text-zinc-100 font-bold">
            Notifications {unreadCount > 0 && unreadCount}
          </Text>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Text className="text-zinc-200">Mark all read</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <View className="flex-1 justify-center items-center bg-white pt-5">
            <ScrollView className="h-full w-full bg-white px-4 pb-12">
              {[...Array(5)].map((_, index) => (
                <NotificationSkeleton key={index} />
              ))}
            </ScrollView>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} className="h-full bg-white px-4">
            <View className="pb-60">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <Swipeable
                    key={notification.id}
                    ref={(ref) => (swipeableRefs.current[notification.id] = ref)}
                    renderRightActions={() => renderRightActions(notification.id, notification.markAsRead)}
                    onSwipeableRightOpen={() => !notification.markAsRead && handleMarkAsRead(notification.id)}
                    renderLeftActions={() => renderLeftActions(notification.id)}
                    onSwipeableLeftOpen={() => handleDeleteNotification(notification.id)}
                  >
                    <View
                      className={`flex flex-row items-start p-4 mt-2 rounded-lg ${notification.markAsRead ? 'bg-zinc-50' : 'bg-blue-100'}`}
                    >
                      <View className="mr-4 bg-blue-50 p-2 rounded-md">
                        {getNotificationIcon(notification.type)}
                      </View>
                      <View className="flex-1">
                        <Text className="text-base text-gray-800 font-medium capitalize">
                          {notification.title}
                        </Text>
                        <Text className="text-gray-500">{notification.message}</Text>
                      </View>
                      <Text className="text-gray-500 text-right absolute right-2 top-2">{formatTimeAgo(notification.createdAt)}</Text>
                    </View>
                  </Swipeable>
                ))
              ) : (
                <View className="flex-1 h-full justify-center items-center">
                  <Text className="text-zinc-500 text-lg mt-5">No Notifications</Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </View>
      <Alert visible={showModal} title="Mark All as Readed" message="Your all notifications get mark readed please confirm before submit" onYes={handleMarkAllAsRead} onNo={() => setShowModal(false)} />
    </SafeAreaView>
  );
};

const getNotificationIcon = (type) => {
  switch (type) {
    case 'pending':
      return <MaterialIcons name="schedule" size={24} color="blue" />;
    case 'scheduled':
      return <MaterialCommunityIcons name="calendar-check" size={24} color="green" />;
    case 'cancelled':
      return <MaterialCommunityIcons name="calendar-remove" size={24} color="red" />;
    case 'rescheduled':
      return <MaterialCommunityIcons name="calendar-clock" size={24} color="#3b82f6" />;
    default:
      return <MaterialCommunityIcons name="bell" size={24} color="#a1a1aa" />;
  }
};

export default Notifications;
