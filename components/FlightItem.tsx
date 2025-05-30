import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Flight } from "../data/flights";
import { formatTime } from "../utils/timeUtils";

interface FlightItemProps {
  item: Flight;
  onPress?: (flight: Flight) => void;
  onShare?: (flight: Flight) => void;
}

const airlineLogoMap: { [key: string]: any } = {
  "singapore airlines": require("../assets/airlines/singapore.png"),
  "airasia": require("../assets/airlines/airasiax.png"),
  "airasia x": require("../assets/airlines/airasiax.png"), // Added for robustness
  "emirates": require("../assets/airlines/emirates.png"),
  "batik air": require("../assets/airlines/batikair.png"),
  "malaysia airlines": require("../assets/airlines/mhlogo.png"),
};

function getAirlineLogo(airlineName: string) {
  if (!airlineName) return null;
  const name = airlineName.toLowerCase();
  for (const key in airlineLogoMap) {
    if (name.includes(key)) {
      return airlineLogoMap[key];
    }
  }
  return null; // or a default logo: require('../assets/airlines/default.png')
}

const FlightItem: React.FC<FlightItemProps> = ({ item, onPress, onShare }) => {
  const statusColors: { [key: string]: string } = {
    "On Time": "text-green-600",
    "Delayed": "text-red-600",
    "Landed": "text-yellow-500",
    "Departs On Time": "text-green-600",
    // Add more statuses and their colors as needed
  };

  const statusColor = statusColors[item.status] || "text-gray-600 dark:text-gray-400";

  // Determine icon color based on status - this will be overridden for the special landed state
  const { theme } = useTheme(); // Get theme for icon colors
  let iconColor = theme === 'dark' ? '#4ade80' : 'green'; // Tailwind green-500 approx
  if (item.status === "Delayed") {
    iconColor = theme === 'dark' ? '#f87171' : 'red'; // Tailwind red-500 approx
  } else if (item.status === "Landed") {
    iconColor = theme === 'dark' ? '#eab308' : '#eab308'; // Yellow for landed status
  }

  // Determine text color for the left column based on status and theme
  const leftColumnTextColor = item.status === 'Landed' 
    ? (theme === 'dark' ? 'text-yellow-500' : 'text-yellow-700') 
    : (theme === 'dark' ? 'text-gray-100' : 'text-gray-800');

  return (
    <TouchableOpacity onPress={() => onPress?.(item)} activeOpacity={0.8}>
      <View className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md mb-4 mx-4 mt-4">
        <View className="flex-row">
          {/* Left Column: Time to Event */}
          <View className="w-1/4 items-center justify-center pr-2 border-r border-gray-200 dark:border-gray-700">
            <Text className={`text-2xl font-semibold ${leftColumnTextColor}`}>
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
                {/* Airline Logo or Icon */}
                {getAirlineLogo(item.airline) ? (
                  <Image
                    source={getAirlineLogo(item.airline)}
                    style={{ width: 40, height: 40, resizeMode: "contain", marginRight: 8 }}
                  />
                ) : (
                  <Ionicons name="airplane" size={20} color={theme === 'dark' ? '#D1D5DB' : '#555'} style={{ marginRight: 8 }} />
                )}
                <Text className="text-sm font-medium text-gray-800 dark:text-gray-200 pr-2">
                  {item.airline} {item.flightNumber}
                </Text>
              </View>
              <Text className={`text-xs font-medium ${statusColor}`}>
                {item.status}
              </Text>
            </View>

            {/* Section 2: City to City */}
            <View className="justify-center">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                {`${item.origin.city} to ${item.destination.city}`}
              </Text>
            </View>

            {/* Section 3: Times and Airport Codes */}
            <View className="flex-row items-center justify-between mt-2">
              {item.id === '4' && item.status === 'Landed' ? (
                // Special display for Dubai flight when landed - Two separate containers
                <View className="flex-row items-center">
                  {/* Baggage Gate */}
                  <View className="flex-row items-center bg-yellow-400 text-black p-2 rounded-md">
                    <MaterialCommunityIcons name="bag-checked" size={16} color="black" />
                    <Text className="text-black ml-1 text-xs">
                      {`Gate: ${item.destination.gate}`}
                    </Text>
                  </View>
                  {/* Spacer between gate and terminal */}
                  <View className="mx-2" />
                  {/* Terminal */}
                  <View className="flex-row items-center bg-yellow-400 text-black p-2 rounded-md">
                    <MaterialCommunityIcons name="airport" size={16} color="black" />
                    <Text className="text-black ml-1 text-xs">
                      {`Terminal: ${item.destination.terminal}`}
                    </Text>
                  </View>
                </View>
              ) : (
                // Default display for other flights/statuses
                <View className="flex-row items-center">
                  {/* Takeoff Info */}
                  <MaterialCommunityIcons name="airplane-takeoff" size={16} color={iconColor} />
                  <Text className="text-xs text-gray-700 dark:text-gray-300 ml-1">
                    {`${item.origin.code} ${formatTime(item.departureTime)}`}
                  </Text>
                  <View className="mx-2" />{/* Spacer */}
                  {/* Landing Info */}
                  <MaterialCommunityIcons name="airplane-landing" size={16} color={iconColor} />
                  <Text className="text-xs text-gray-700 dark:text-gray-300 ml-1">
                    {`${item.destination.code} ${formatTime(item.arrivalTime)}`}
                  </Text>
                </View>
              )}
              
              {/* Share Button */}
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation();
                  console.log('Share button pressed for flight:', item.id);
                  onShare?.(item);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="share-social-outline" size={24} color={theme === 'dark' ? "white" : "#4B5563"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FlightItem;