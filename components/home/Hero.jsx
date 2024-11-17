import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';

const Shapes = () => (
  <>
    <Svg
      style={{ position: 'absolute', top: 0, right: 0, display: 'none', zIndex: -10 }}
      width="492"
      height="619"
      viewBox="0 0 492 619"
      fill="currentColor"
    >
      <Circle cx="389" cy="230" r="389" fill="currentColor" />
    </Svg>
    <Svg
      style={{ position: 'absolute', top: '35%', left: '5%', zIndex: -10 }}
      width="49"
      height="40"
      viewBox="0 0 49 40"
      fill="none"
    >
      <Path
        d="M39.7007 19.7167C64.5265 24.2635 33.2736 43.5256 19.8503 39.4334C6.42703 35.3413 0 30.6059 0 19.7167C0 8.82747 8.8873 0 19.8503 0C30.8134 0 14.8749 15.1699 39.7007 19.7167Z"
        fill="#1DC9FF"
        fillOpacity="0.6"
      />
    </Svg>
    <Svg
      style={{ position: 'absolute', bottom: 0, left: 0, zIndex: -10 }}
      width="100"
      height="301"
      viewBox="0 0 100 301"
      fill="none"
    >
      <Path
        d="M100 7.37581C100 3.30288 96.795 0 92.8428 0C88.8892 0 85.6856 3.30288 85.6856 7.37581H100ZM22.4316 235.974C18.4794 235.974 15.2744 239.275 15.2744 243.349C15.2744 247.422 18.4794 250.725 22.4316 250.725V235.974ZM-78.8428 320.248C-82.795 320.248 -86 323.551 -86 327.624C-86 331.699 -82.795 335 -78.8428 335V320.248ZM6.44099 264.17C6.44099 260.097 3.23743 256.794 -0.716209 256.794C-4.66842 256.794 -7.87341 260.097 -7.87341 264.17H6.44099ZM85.6856 7.37581V97.6368H100V7.37581H85.6856ZM85.6856 97.6368C85.6856 107.708 77.6867 115.966 67.6953 115.966V130.717C85.4809 130.717 100 115.969 100 97.6368H85.6856ZM67.6953 115.966C49.9067 115.966 35.3919 130.728 35.3919 149.058H49.7063C49.7063 138.981 57.7081 130.717 67.6953 130.717V115.966ZM35.3919 149.058V154.391H49.7063V149.058H35.3919ZM35.3919 154.391C35.3919 172.72 49.9067 187.483 67.6953 187.483V172.732C57.7081 172.732 49.7063 164.466 49.7063 154.391H35.3919ZM67.6953 187.483C77.6838 187.483 85.6856 195.747 85.6856 205.823H100C100 187.494 85.4852 172.732 67.6953 172.732V187.483ZM85.6856 205.823V211.728H100V205.823H85.6856ZM85.6856 211.728C85.6856 225.065 75.0972 235.974 61.9208 235.974V250.725C82.9 250.725 100 233.318 100 211.728H85.6856ZM61.9208 235.974H45.9016V250.725H61.9208V235.974ZM45.9016 235.974H22.4316V250.725H45.9016V235.974ZM-78.8428 335H-62.3655V320.248H-78.8428V335ZM-62.3655 335C-24.3722 335 6.44099 303.297 6.44099 264.17H-7.87341C-7.87341 295.134 -32.2623 320.248 -62.3655 320.248V335Z"
        fill="#FDB314"
        fillOpacity="0.32"
      />
    </Svg>
    <Svg
      style={{ position: 'absolute', top: 100, left: '-5%', zIndex: 10 }}
      width="90"
      height="81"
      viewBox="0 0 90 81"
      fill="none"
    >
      <Path
        d="M85.8436 9.44612L39.2469 77.0032L4.08537 2.92747L85.8436 9.44612Z"
        stroke="#4175DF"
        strokeOpacity="0.78"
        strokeWidth="4"
      />
    </Svg>
    <Svg
      style={{ position: 'absolute', top: 10, right: 0 }}
      width="134"
      height="133"
      viewBox="0 0 134 133"
      fill="none"
    >
      <Path
        d="M66.9999 133C104.003 133 134 103.227 134 66.5C134 29.773 104.003 0 66.9999 0C29.9968 0 0 29.773 0 66.5C0 103.227 29.9968 133 66.9999 133Z"
        fill="#FF9100"
        fillOpacity="0.59"
      />
    </Svg>
    <Svg
      style={{ position: 'absolute', top: '20%', right: '2%', zIndex: -10 }}
      width="149"
      height="255"
      viewBox="0 0 149 255"
      fill="none"
    >
      <G opacity="0.2">
        <Path
          d="M29.9138 200.627C16.1542 200.627 5 211.61 5 225.159C5 238.709 16.1542 249.692 29.9138 249.692C43.6732 249.692 54.8275 238.709 54.8275 225.159V124.964"
          stroke="#4484AB"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M82.5575 92.916C97.6331 92.916 109.854 80.6999 109.854 65.6317C109.854 50.5624 97.6331 38.3473 82.5575 38.3473C67.4819 38.3473 55.2607 50.5624 55.2607 65.6317C55.2607 80.6999 67.4819 92.916 82.5575 92.916Z"
          stroke="#4484AB"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  </>
);

const HeroHeader = () => {
  const router = useRouter();
  return (
    <View className="dark:bg-slate-950 pt-10 -mt-14 bg-white">
      <Shapes />
      <View className="px-4">
        <View className="py-6">
          <View className="flex justify-center items-center">
            <View className='w-72 h-72 rounded-full absolute -top-24 -left-16 bg-blue-50 -z-50'></View>
            <Image
              source={require('../../assets/success.png')}
              className="h-64 w-56 rounded-full"
              resizeMode="cover"
            />
          </View>
          <View className="text-center">
            <Text className="text-4xl text-center font-extrabold text-blue-500 dark:text-slate-50">
            ZivaCare
            </Text>
            <Text className="mt-4 text-lg text-center text-slate-600 dark:text-slate-400">
              Welcome to our restaurant app. Discover the best dishes from around the world.
            </Text>
          </View>
          <View className="mt-8 flex justify-center w-[200px] mx-auto">
            <TouchableOpacity
              className="px-4 py-2 bg-blue-500 rounded-md"
              onPress={() => router.push('/home/appointment-booking')}
            >
              <Text className="text-white text-lg text-center ">
                Schedule Now
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </View>
  );
};

export default HeroHeader;
