import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
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

  const statusColor = statusColors[item.status] || "text-gray-600";

  // Determine icon color based on status
  let iconColor = "green"; // Default to green
  if (item.status === "Delayed") {
    iconColor = "red";
  } else if (item.status === "Landed") {
    // Keep landed icon green, or choose another color e.g. blue
    iconColor = "green"; // Or "blue" to match status text color potentially
  }

  return (
    <View className="bg-white p-3 rounded-lg shadow-md mb-4 mx-4">
      <View className="flex-row">
        {/* Left Column: Time to Event */}
        <View className="w-1/4 items-center justify-center pr-2 border-r border-gray-200">
          <Text className="text-2xl font-semibold text-gray-800">
            {item.timeToEventMajor}
          </Text>
          {item.timeToEventMinor && (
            <Text className="text-xs text-gray-500 uppercase">
              {item.timeToEventMinor.toUpperCase()}
            </Text>
          )}
        </View>

        {/* Right Column: Flight Details */}
        <View className="flex-1 pl-3">
          {/* Section 1: Airline, Flight #, Status */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="airplane" size={20} color="#555" />
              <Text className="text-sm font-medium text-gray-800 ml-2">
                {item.airline} {item.flightNumber}
              </Text>
            </View>
            <Text className={`text-xs font-medium ${statusColor}`}>
              {item.status}
            </Text>
          </View>

          {/* Section 2: City to City */}
          <Text className="text-lg font-semibold text-gray-900 mt-1">
            {item.origin.city} to {item.destination.city}
          </Text>

          {/* Section 3: Times and Airport Codes */}
          <View className="flex-row items-center mt-1.5">
            <MaterialCommunityIcons name="airplane-takeoff" size={16} color={iconColor} />
            <Text className="text-xs text-gray-700 ml-1">
              {item.origin.code} {formatTime(item.departureTime)}
            </Text>
            <View className="mx-2" />{/* Spacer */}
            <MaterialCommunityIcons name="airplane-landing" size={16} color={iconColor} />
            <Text className="text-xs text-gray-700 ml-1">
              {item.destination.code} {formatTime(item.arrivalTime)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FlightItem; 