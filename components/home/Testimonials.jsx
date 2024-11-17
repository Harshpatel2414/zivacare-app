import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import PropTypes from 'prop-types';

const testimonialList = [
  {
    author: {
      fullName: "Akshay Kumar",
      picture: "https://cdn.easyfrontend.com/pictures/users/user3.jpg",
      designation: "Founder / CEO",
    },
    rating: 4,
    description:
      "Assumenda non repellendus distinctio nihil dicta sapiente, quibusdam maiores, illum at, aliquid blanditiis eligendi qui.",
  },
  {
    author: {
      fullName: "Raima Sen",
      picture: "https://cdn.easyfrontend.com/pictures/users/user25.jpg",
      designation: "Founder / CEO",
    },
    rating: 3.5,
    description:
      "Assumenda non repellendus distinctio nihil dicta sapiente, quibusdam maiores, illum at, aliquid blanditiis eligendi qui.",
  },
  {
    author: {
      fullName: "Arjun Kapur",
      picture: "https://cdn.easyfrontend.com/pictures/users/user11.jpg",
      designation: "Founder / CEO",
    },
    rating: 3.5,
    description:
      "Assumenda non repellendus distinctio nihil dicta sapiente, quibusdam maiores, illum at, aliquid blanditiis eligendi qui.",
  },
];

const Rating = ({ rating, showLabel, className, ...rest }) => (
  <View className={`mb-4 ${className}`} {...rest}>
    <View className="flex flex-row">
      {[...Array(5)].map((_, i) => {
        const index = i + 1;
        let content = null;
        if (index <= Math.floor(rating)) {
          content = <FontAwesome key={i} name="star" style={{ marginRight: 4, color: '#3b82f6' }} />;
        } else if (rating > i && rating < index + 1) {
          content = <FontAwesome key={i} name="star-half" style={{ marginRight: 4, color: '#3b82f6' }} />;
        } else if (index > rating) {
          content = <FontAwesome key={i} name="star" style={{ marginRight: 4, color: '#9ca3af' }} />;
        }
        return content;
      })}
    </View>
    {showLabel && <Text>{rating.toFixed(1)}</Text>}
  </View>
);

Rating.propTypes = {
  rating: PropTypes.number.isRequired,
  showLabel: PropTypes.bool,
  className: PropTypes.string,
};

const TestimonialItem = ({ testimonial }) => (
  <View className="bg-white rounded-lg shadow-lg p-4 mt-5 w-80">
    <View className="items-center">
      <Image
        source={{ uri: testimonial.author.picture }}
        className="h-24 w-24 rounded-full p-1"
        resizeMode="cover"
      />
    </View>
    <View className="px-4 pt-4 pb-5">
      <View className="items-center">
        <Text className="text-xl font-bold mb-1">{testimonial.author.fullName}</Text>
        <Rating rating={testimonial.rating} showLabel={false} />
      </View>
      <Text className="text-gray-600">{testimonial.description}</Text>
    </View>
  </View>
);


const Testimonial = () => {
  return (
    <View className="py-10 px-4 bg-blue-100">
      <View className="items-center mb-10">
        <Text className="text-2xl font-bold mb-4">Community Reviews</Text>
        <Text className="text-lg text-gray-600">
          It&apos;s easier to reach your savings goals when you have the right savings account. Take a look and find the right one for you!
        </Text>
      </View>
      <FlatList
        data={testimonialList}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <TestimonialItem testimonial={item} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.container}
        numColumns={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
});

export default Testimonial;
