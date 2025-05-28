import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";
import FlightList from "../../components/FlightList";
import ListHeader from "../../components/ListHeader";
import { useTheme } from "../../context/ThemeContext";

export default function FlightScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View className={`flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'} pt-12`}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <ListHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <FlightList searchQuery={searchQuery} />
    </View>
  );
}