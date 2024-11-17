// import React from 'react';
// import { View, Text, TouchableOpacity, FlatList } from 'react-native';
// import { treatments } from '../../data/Treatments'; // Assuming you have this data
// import { useRouter } from 'expo-router';

// const TreatmentsList = () => {
//   const router = useRouter();

//   return (
//     <View className="p-2 mx-2">
//       <Text className="text-lg font-bold mb-2">Available Treatments</Text>
//       <FlatList
//         data={treatments}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             className="p-2 bg-white drop-shadow-md rounded-md mb-2"
//             onPress={() => router.push(`/home/treatments/${item.id}`)}
//           >
//             <Text className="text-lg">{item.name}</Text>
//             <Text>{item.description}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// export default TreatmentsList;


import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';  // Ensure you have react-native-vector-icons or similar installed

const treatments = [
  { id: 1, name: 'Acne', icon: 'healing' },
  { id: 2, name: 'Anti-Aging', icon: 'face-retouching-natural' },
  { id: 3, name: 'Brightening', icon: 'wb-sunny' },
  { id: 4, name: 'Hydration', icon: 'local-drink' },
  { id: 5, name: 'Peeling', icon: 'spa' },
  { id: 6, name: 'Sun Protection', icon: 'beach-access' },
];

const Treatments = () => {
  return (
    <View className="p-4 bg-white dark:bg-gray-800">
      <Text className="text-lg font-bold mb-5">Types of Treatments</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-4 -mr-5">
        {treatments.map((treatment) => (
          <TouchableOpacity key={treatment.id} className="items-center mx-2 ">
            <View className="w-20 h-20 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2 drop-shadow-xl">
              <MaterialIcons name={treatment.icon} size={28} color="#3b82f6" />
            </View>
            <Text className="text-center text-sm text-gray-500">{treatment.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Treatments;

