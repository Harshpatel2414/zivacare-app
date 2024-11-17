import React from 'react';
import { TextInput } from 'react-native';

const Input = ({ placeholder, value, onChangeText, secureTextEntry, multiline }) => {
  return (
    <TextInput
      className="border bg-zinc-50 border-gray-300 p-3 rounded-md mt-2"
      placeholder={placeholder}
      value={value}
      multiline={multiline>0 ? true : false}
      numberOfLines={multiline>0 ? 4 : 1}
      textAlignVertical={multiline && 'top'}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  );
};

export default Input;
