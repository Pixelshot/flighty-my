import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Switch, Text, TextInput, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const ListHeader: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <View className="pt-12 px-4 pb-4 bg-gray-100 dark:bg-gray-900">
      {/* Top Row: Title and Icons */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Text className="text-3xl font-bold text-gray-800 dark:text-white">My Flights</Text>
          <Ionicons name="chevron-down" size={20} color={theme === 'dark' ? "white" : "#4B5563"} style={{ marginLeft: 5, marginTop: 5 }} />
        </View>
        <View className="flex-row items-center space-x-3">
          {/* Theme Toggle Switch */}
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={theme === 'dark' ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={theme === "dark"}
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          />
          <Ionicons name="share-social-outline" size={24} color={theme === 'dark' ? "white" : "#4B5563"} />
          <MaterialCommunityIcons name="account-circle-outline" size={28} color={theme === 'dark' ? "white" : "#4B5563"} />
        </View>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-2">
        <Ionicons name="search" size={20} color={theme === 'dark' ? "white" : "#4B5563"} style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search to add flights"
          placeholderTextColor={theme === 'dark' ? "#A0A0A0" : "#6B7280"}
          className="flex-1 text-base text-gray-800 dark:text-white"
        />
      </View>
    </View>
  );
};

export default ListHeader; 