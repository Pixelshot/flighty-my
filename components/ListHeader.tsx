import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, View } from 'react-native';

const ListHeader: React.FC = () => {
  return (
    <View className="px-4 pt-2 pb-3 bg-gray-100">
      {/* My Flights Title Row */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Text className="text-3xl font-bold text-black">My Flights</Text>
          <Ionicons name="chevron-down" size={24} color="black" style={{ marginLeft: 4, marginTop: 2 }} />
        </View>
        <View className="flex-row items-center space-x-3">
          <Ionicons name="share-social-outline" size={26} color="black" />
          <Ionicons name="person-circle-outline" size={30} color="black" />
        </View>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center bg-gray-200 p-3 rounded-lg">
        <MaterialCommunityIcons name="magnify" size={22} color="#6B7280" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search to add flights"
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-base text-black"
        />
      </View>
    </View>
  );
};

export default ListHeader; 