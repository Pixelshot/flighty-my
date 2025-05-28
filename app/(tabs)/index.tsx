import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Dimensions, View } from "react-native";
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import FlightList from "../../components/FlightList";
import ListHeader from "../../components/ListHeader";
import { useTheme } from "../../context/ThemeContext";

const { height: screenHeight } = Dimensions.get('window');
const panelHeight = screenHeight * 0.5; // 60% of screen height
const initialSnapPoint = 0; // Panel at the bottom
// const middleSnapPoint = -screenHeight * 0.4; // Roughly half way up
const topSnapPoint = -(panelHeight - 160); // Adjusted: Top of panel 100 units from screen top

const lowerSnapPoint = panelHeight - 380; // Allow panel to be dragged down near the bottom of the screen

type GestureContext = {
  startY: number;
};

export default function FlightScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  // Shared value for the panel's vertical position
  const translateY = useSharedValue(initialSnapPoint);

  // Store the starting position when the gesture begins
  const context = useSharedValue<GestureContext>({ startY: 0 });


  // Animated gesture handler
  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, GestureContext>({
    onStart: (event, ctx) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      // Limit dragging within bounds
      const newTranslateY = ctx.startY + event.translationY;
      translateY.value = Math.max(Math.min(newTranslateY, lowerSnapPoint), topSnapPoint); // Use lowerSnapPoint here
    },
    onEnd: (event, ctx) => {
      // You can add snapping logic here later if needed
      // For now, it just stops where the drag ends.
    },
  });

  // Animated style for the draggable panel
  const panelAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value }
      ],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className={`flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />

        {/* Placeholder for the map */}
        <View className="flex-1 bg-blue-300" />

        {/* Draggable Panel */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              { position: 'absolute', bottom: 0, left: 0, right: 0, height: panelHeight, backgroundColor: theme === 'dark' ? 'black' : 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 16, flex: 1, flexDirection: 'column' },
              panelAnimatedStyle
            ]}
          >
            <ListHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <View style={{ flex: 1 }}>
              <FlightList searchQuery={searchQuery} />
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
}