// import { createContext, useContext, useEffect, useState, useRef } from "react";
// import { db } from "../app/firebase/firebase";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { collection, onSnapshot, query } from "firebase/firestore";
// import { Audio } from 'expo-av';  // Import expo-av for sound
// import { router } from 'expo-router';

// export const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);

// export const AuthContextProvider = ({ children }) => {
//     const [notifications, setNotifications] = useState([]);
//     const [user, setUser] = useState(null);
//     const [unreadCount, setUnreadCount] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [sound, setSound] = useState(null); // State to store the sound object
//     const previousUnreadCount = useRef(0); // To store the previous unread count

//     // Load sound when component mounts
//     useEffect(() => {
//         const loadSound = async () => {
//             const { sound } = await Audio.Sound.createAsync(
//                 require('../assets/notification1.mp3')  // Your notification sound file
//             );
//             setSound(sound);
//         };
//         loadSound();

//         return () => {
//             // Unload sound when component unmounts
//             if (sound) {
//                 sound.unloadAsync();
//             }
//         };
//     }, []);

//     useEffect(() => {
//         const fetchUser = async () => {
//             const storedUser = await AsyncStorage.getItem('user');
//             if (storedUser) {
//                 const parsedUser = JSON.parse(storedUser);
//                 setUser(parsedUser);
//                 loadNotifications(parsedUser.userId);
//             } else {
//                 const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleteds');
//                 if (onboardingCompleted === 'true') {
//                     router.replace('/screens/EnterMobileNumber');
//                 } else {
//                     router.replace('/');
//                 }
//             }
//             setLoading(false);
//         };

//         const loadNotifications = (userId) => {
//             const q = query(collection(db, "Users", userId, "notifications"));
//             const unsubscribe = onSnapshot(q, (snapshot) => {
//                 const fetchedNotifications = snapshot.docs.map((doc) => {
//                     const data = doc.data();
//                     return {
//                         id: doc.id,
//                         ...data,
//                         createdAt: new Date(data.createdAt) 
//                     };
//                 });

//                 fetchedNotifications.sort((a, b) => b.createdAt - a.createdAt);

//                 const unread = fetchedNotifications.filter(notification => !notification.markAsRead).length;
//                 setUnreadCount(unread);
//                 setNotifications(fetchedNotifications);
//             });
//             return unsubscribe;
//         };

//         fetchUser();
//     }, []);

//     useEffect(() => {
//         const saveUser = async () => {
//             if (user) {
//                 await AsyncStorage.setItem('user', JSON.stringify(user));
//             }
//         };
//         saveUser();
//     }, [user]);

//     // Play notification sound when unreadCount increases
//     useEffect(() => {
//         if (unreadCount > previousUnreadCount.current && sound) {
//             sound.replayAsync(); 
//         }
//         previousUnreadCount.current = unreadCount; 
//     }, [unreadCount, sound]);

//     const userLogout = async () => {
//         await AsyncStorage.removeItem('user');
//         await AsyncStorage.removeItem('onboardingCompleted');
//         setUser(null);
//         router.replace('/screens/EnterMobileNumber'); 
//     };

//     return (
//         <AuthContext.Provider value={{ notifications, unreadCount, user, setUser, userLogout, loading }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { db } from "../app/firebase/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, onSnapshot, query } from "firebase/firestore";
import { Audio } from 'expo-av';  // Import expo-av for sound
import { router } from 'expo-router';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [user, setUser] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sound, setSound] = useState(null);
    const previousUnreadCount = useRef(0); 
    const unsubscribeRef = useRef(null);

    // Load sound when component mounts
    useEffect(() => {
        const loadSound = async () => {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/notification1.mp3') 
            );
            setSound(sound);
        };
        loadSound();

        return () => {
            // Unload sound when component unmounts
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    // Fetch user and load notifications
    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } else {
                const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
                if (onboardingCompleted === 'true') {
                    router.replace('/screens/EnterMobileNumber');
                } else {
                    router.replace('/');
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    // Fetch notifications whenever the user changes
    useEffect(() => {
        if (unsubscribeRef.current) {
            unsubscribeRef.current(); // Unsubscribe from previous listener
        }

        if (user) {
            const loadNotifications = (userId) => {
                const q = query(collection(db, "Users", userId, "notifications"));
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const fetchedNotifications = snapshot.docs.map((doc) => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            ...data,
                            createdAt: new Date(data.createdAt) 
                        };
                    });

                    fetchedNotifications.sort((a, b) => b.createdAt - a.createdAt);

                    const unread = fetchedNotifications.filter(notification => !notification.markAsRead).length;
                    setUnreadCount(unread);
                    setNotifications(fetchedNotifications);
                });
                return unsubscribe;
            };

            unsubscribeRef.current = loadNotifications(user.userId); // Store the unsubscribe function
        }
    }, [user]);

    // Save user to AsyncStorage whenever it changes
    useEffect(() => {
        const saveUser = async () => {
            if (user) {
                await AsyncStorage.setItem('user', JSON.stringify(user));
            }
        };
        saveUser();
    }, [user]);

    // Play notification sound when unreadCount increases
    useEffect(() => {
        if (unreadCount > previousUnreadCount.current && sound) {
            sound.replayAsync(); 
        }
        previousUnreadCount.current = unreadCount; 
    }, [unreadCount, sound]);

    const userLogout = async () => {
        if (unsubscribeRef.current) {
            unsubscribeRef.current(); // Unsubscribe from notifications listener
        }
        await AsyncStorage.removeItem('user');
        setUser(null);
        setNotifications([]); // Clear notifications on logout
        // router.replace('/screens/EnterMobileNumber'); 
    };

    return (
        <AuthContext.Provider value={{ notifications, unreadCount, user, setUser, userLogout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
