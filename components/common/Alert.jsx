import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Alert = ({ visible,title, message, onClose, onYes, onNo, type }) => {
    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} className="flex-1 justify-center items-center bg-zinc-500">
                <View className="bg-white rounded-lg p-6 w-3/4">
                    {type && <View className="flex items-center mb-4">
                        <Ionicons name={type === "success" ? "checkmark-circle" : "alert"} size={50} color={type === "success" ? "#2563eb" : "#ef4444"} />
                    </View>}
                    <Text className="text-lg font-semibold capitalize text-center mb-1">{title && title}</Text>
                    <Text className={`text-base text-center mb-4 capitalize ${type==="success" ? 'text-blue-500' : 'text-red-500'}`}>{message}</Text>
                    <View className="flex-row justify-center">
                        {onYes && onNo ? (
                            <View className='w-full items-center justify-center flex-row'>
                                <TouchableOpacity className="bg-gray-600 rounded p-2 w-1/3 mx-2" onPress={onNo}>
                                    <Text className="text-white text-center">No</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="bg-blue-600 rounded p-2 w-1/3 mx-2" onPress={onYes}>
                                    <Text className="text-white text-center">Yes</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity className="bg-blue-600 rounded p-2 w-full" onPress={onClose}>
                                <Text className="text-white text-center">Close</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default Alert;