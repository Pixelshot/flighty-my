import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { LayoutChangeEvent, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

type ListHeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
  currentPanelState: 'top' | 'default' | 'lower';
  isSimulationActive?: boolean;
  onToggleSimulation?: () => void;
};

const ListHeader: React.FC<ListHeaderProps> = ({ searchQuery, setSearchQuery, onLayout, currentPanelState, isSimulationActive, onToggleSimulation }) => {
  const { theme, toggleTheme } = useTheme();

  // Shared value for the indicator's horizontal position
  const indicatorTranslateX = useSharedValue(0);

  // Define positions for the indicator based on panel state. These will need adjustment based on layout.
  // These are the horizontal offsets relative to the centered position (left: '50%' and translateX negative half width)
  const indicatorPositions = {
    top: -90, // Move further left for top state (adjust this value)
    default: 0, // Center for default state
    lower: 90, // Move further right for lower state (adjust this value)
  };

  // Animate indicator position when panelState changes
  React.useEffect(() => {
    let targetPosition = 0;
    switch (currentPanelState) {
      case 'top':
        targetPosition = indicatorPositions.top;
        break;
      case 'default':
        targetPosition = indicatorPositions.default;
        break;
      case 'lower':
        targetPosition = indicatorPositions.lower;
        break;
    }
    indicatorTranslateX.value = withSpring(targetPosition);
  }, [currentPanelState]);

  // Animated style for the longer indicator (centered)
  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        // Apply the animated horizontal movement, offset by half its width to center
        { translateX: indicatorTranslateX.value - 40 }, // -40 to center a 80 width bar
      ],
    };
  });

  // Animated style for the shorter indicator (centered)
  const shorterIndicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        // Apply the same animated horizontal movement, offset by half its width to center
        { translateX: indicatorTranslateX.value - 30 }, // -30 to center a 60 width bar
      ],
    };
  });

  return (
    <View className="pt-12 px-4 pb-4" onLayout={onLayout}>
      {/* Top Row: Title and Icons */}
      <View className="flex-row justify-between items-center mb-4">
        {/* Animated Indicator (Longer Bar) */}
        <Animated.View
          style={[
            {
              width: 80,
              height: 5,
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
              borderRadius: 2.5,
              position: 'absolute',
              top: -45, // Move it slightly higher
              left: '50%', // Position left edge at center
            },
            indicatorAnimatedStyle, // Applies the horizontal animation and centering offset
          ]}
        />
        {/* Second Animated Indicator (Shorter Bar) */}
        <Animated.View
          style={[
            {
              width: 60,
              height: 5,
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
              borderRadius: 2.5,
              position: 'absolute',
              top: -35, // Move it slightly higher, maintaining gap relative to the first bar
              left: '50%', // Position left edge at center
            },
            shorterIndicatorAnimatedStyle, // Applies the horizontal animation and centering offset
          ]}
        />
        <View className="flex-row items-center">
          <Text className="text-3xl font-bold text-gray-800 dark:text-white">My Flights</Text>
          <Ionicons name="chevron-down" size={20} color={theme === 'dark' ? "white" : "#4B5563"} style={{ marginLeft: 5, marginTop: 5 }} />
          {/* Manual Simulation Toggle Button */}
          {onToggleSimulation && (
            <TouchableOpacity onPress={onToggleSimulation} className="ml-3 mt-1">
              <MaterialCommunityIcons 
                name={isSimulationActive ? "airplane-alert" : "airplane-check"} 
                size={24} 
                color={isSimulationActive ? "#EF4444" : "#10B981"} // Red when active, green when inactive
              />
            </TouchableOpacity>
          )}
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
          {/* <Ionicons name="share-social-outline" size={24} color={theme === 'dark' ? "white" : "#4B5563"} /> */}
          <MaterialCommunityIcons name="account-circle-outline" size={28} color={theme === 'dark' ? "white" : "#4B5563"} />
        </View>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-2">
        <Ionicons name="search" size={20} color={theme === 'dark' ? "white" : "#4B5563"} style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search for flights"
          placeholderTextColor={theme === 'dark' ? "#A0A0A0" : "#6B7280"}
          className="flex-1 text-base text-gray-800 dark:text-white"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </View>
  );
};

export default ListHeader; 