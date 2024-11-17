import { View, Text, Image } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons'

export default function ReviewCard({ review }) {
    return (
        <View className="p-4 bg-zinc-50 mb-3 rounded-lg drop-shadow-md w-full">
            <View className="flex-row justify-between items-start mb-2">
                <View className='flex flex-row gap-2 items-center'>
                    <View>
                        <Image source={{ uri: review.imageUrl }} resizeMode='cover' className='h-12 w-12 rounded-full bg-blue-100' />
                    </View>
                    <View>
                        <Text className="text-base font-bold">{review.userName}</Text>
                        <Text className="text-gray-600 text-sm">{review.date.slice(0,10)}</Text>
                    </View>
                </View>
                <View className="flex-row items-center">
                    {[...Array(5)].map((_, index) => (
                        <FontAwesome
                            key={index}
                            name={index < review.rating ? "star" : "star-o"}
                            size={16}
                            color="#2563eb"
                            style={{ marginLeft: 4 }}
                        />
                    ))}
                </View>
            </View>
            <Text className="mt-2 text-gray-800">{review.comment}</Text>
        </View>
    )
}