
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Flight } from "../data/flights";
import { formatTime } from "../utils/timeUtils";

interface FlightItemProps {
  item: Flight;
}

const FlightItem: React.FC<FlightItemProps> = ({ item }) => {
  const statusColors: { [key: string]: string } = {
    "On Time": "text-green-600",
    "Delayed": "text-red-600",
    "Landed": "text-blue-600",
    "Departs On Time": "text-green-600",
    // Add more statuses and their colors as needed
  };

  const statusColor = statusColors[item.status] || "text-gray-600 dark:text-gray-400";

  // Determine icon color based on status
  const { theme } = useTheme(); // Get theme for icon colors
  let iconColor = theme === 'dark' ? '#4ade80' : 'green'; // Tailwind green-500 approx
  if (item.status === "Delayed") {
    iconColor = theme === 'dark' ? '#f87171' : 'red'; // Tailwind red-500 approx
  } else if (item.status === "Landed") {
    iconColor = theme === 'dark' ? '#60a5fa' : 'blue'; // Tailwind blue-500 approx
  }

  return (
    <View className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md mb-4 mx-4 mt-4">
      <View className="flex-row">
        {/* Left Column: Time to Event */}
        <View className="w-1/4 items-center justify-center pr-2 border-r border-gray-200 dark:border-gray-700">
          <Text className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {item.timeToEventMajor}
          </Text>
          {item.timeToEventMinor && (
            <Text className="text-xs text-gray-500 dark:text-gray-400 uppercase">
              {item.timeToEventMinor.toUpperCase()}
            </Text>
          )}
        </View>

        {/* Right Column: Flight Details */}
        <View className="flex-1 pl-3">
          {/* Section 1: Airline, Flight #, Status */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="airplane" size={20} color={theme === 'dark' ? '#D1D5DB' : '#555'} />
              <Text className="text-sm font-medium text-gray-800 dark:text-gray-200 ml-2 pr-2">
                {item.airline} {item.flightNumber}
              </Text>
            </View>
            <Text className={`text-xs font-medium ${statusColor}`}>
              {item.status}
            </Text>
          </View>

          {/* Section 2: City to City */}
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
            {item.origin.city} to {item.destination.city}
          </Text>

          {/* Section 3: Times and Airport Codes */}
          <View className="flex-row items-center mt-2">
            <MaterialCommunityIcons name="airplane-takeoff" size={16} color={iconColor} />
            <Text className="text-xs text-gray-700 dark:text-gray-300 ml-1">
              {item.origin.code} {formatTime(item.departureTime)}
            </Text>
            <View className="mx-2" />{/* Spacer */}
            <MaterialCommunityIcons name="airplane-landing" size={16} color={iconColor} />
            <Text className="text-xs text-gray-700 dark:text-gray-300 ml-1">
              {item.destination.code} {formatTime(item.arrivalTime)}
            </Text>
            <View className="mx-10" />{/* Spacer */}
           <Ionicons name="share-social-outline" size={24} color={theme === 'dark' ? "white" : "#4B5563"} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default FlightItem; 