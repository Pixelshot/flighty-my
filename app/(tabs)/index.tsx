import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Share, Text, View } from "react-native";
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent, State, TapGestureHandler } from 'react-native-gesture-handler';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import FlightList from "../../components/FlightList";
import ListHeader from "../../components/ListHeader";
import { useTheme } from "../../context/ThemeContext";
import { Flight, dummyFlights } from "../../data/flights";
// import { fetchFlights } from "../../services/flightService"; // Comment out fetchFlights import

const { height: screenHeight } = Dimensions.get('window');
const panelHeight = screenHeight * 0.95; // Increased panel height (used for calculation, not fixed height of view)

// Snap points represent distance from the TOP of the screen
const topSnapPoint = panelHeight - 760; // Top of panel 760 units from panel bottom (which is at screen top initially)
const defaultSnapPoint = screenHeight - (panelHeight - 360); // The desired default/initial position from top
const lowerSnapPoint = screenHeight - 100; // Panel bottom 100 units from screen bottom (panel top at screenHeight - 100 - panelHeight)
const maxTranslateY = lowerSnapPoint; // Maximum translateY to keep panel bottom 100 units from screen bottom

type GestureContext = {
  startY: number;
};

export default function FlightScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlightCoords, setSelectedFlightCoords] = useState<{ origin?: { latitude: number, longitude: number }, destination?: { latitude: number, longitude: number } } | null>(null);
  const mapRef = useRef<MapView>(null); // Ref for map
  const [isSharing, setIsSharing] = useState(false);
  const shareTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Shared value for the panel's vertical position (distance from top)
  const translateY = useSharedValue(defaultSnapPoint);

  // State to manage panel snap position (for toggling)
  const [panelState, setPanelState] = useState('default'); // 'default', 'lower', 'top'

  // Store the starting position when the gesture begins
  const context = useSharedValue<GestureContext>({ startY: 0 });

  useEffect(() => {
    // Use dummy data instead of fetching from API
    setLoading(true);
    // Simulate a small loading delay if needed for visual testing
    // const loadTimeout = setTimeout(() => {
      setFlights(dummyFlights);
      setLoading(false);
    // }, 1000); // Adjust delay as needed
    // return () => clearTimeout(loadTimeout);
  }, []);

  // Measure the header height
  const handleHeaderLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  // Function to handle flight item press
  const handleFlightPress = (flight: Flight) => {
    if (flight.origin?.latitude !== undefined && flight.origin?.longitude !== undefined && flight.destination?.latitude !== undefined && flight.destination?.longitude !== undefined) {
      const originCoord = { latitude: flight.origin.latitude, longitude: flight.origin.longitude };
      const destinationCoord = { latitude: flight.destination.latitude, longitude: flight.destination.longitude };
      setSelectedFlightCoords({ origin: originCoord, destination: destinationCoord });
      // Animate map to origin location
      mapRef.current?.animateToRegion({
        latitude: originCoord.latitude,
        longitude: originCoord.longitude,
        latitudeDelta: 2,
        longitudeDelta: 2,
      }, 1000);
    } else {
      setSelectedFlightCoords(null);
      console.warn('Coordinates not available for this flight.');
    }
  };

  // Function to handle share button press
  const handleShare = async (flight: Flight) => {
    console.log('handleShare called with flight:', flight);
    
    // Prevent multiple rapid presses
    if (isSharing) {
      console.log('Already sharing, returning');
      return;
    }
    
    // Clear any existing timeout
    if (shareTimeoutRef.current) {
      clearTimeout(shareTimeoutRef.current);
    }

    try {
      setIsSharing(true);
      console.log('Attempting to share...');
      
      const shareOptions = {
        message: `✈️ Flight Details\n\n` +
          `Airline: ${flight.airline}\n` +
          `Flight: ${flight.flightNumber}\n` +
          `Route: ${flight.origin.city} (${flight.origin.code}) → ${flight.destination.city} (${flight.destination.code})\n` +
          `Status: ${flight.status}\n` +
          `Departure: ${flight.departureTime}\n` +
          `Arrival: ${flight.arrivalTime}`,
        title: `${flight.airline} ${flight.flightNumber}`,
      };
      
      console.log('Share options:', shareOptions);
      const result = await Share.share(shareOptions);
      console.log('Share result:', result);

      if (result.action === Share.sharedAction) {
        Alert.alert('Success', 'Flight details shared successfully!', [{ text: 'OK' }]);
      }
    } catch (error: any) {
      console.error('Error in handleShare:', error);
      Alert.alert('Error', 'Failed to share flight details. Please try again.', [{ text: 'OK' }]);
    } finally {
      // Add a small delay before allowing another share
      shareTimeoutRef.current = setTimeout(() => {
        setIsSharing(false);
      }, 1000);
    }
  };

  // Handle double tap on header
  const handleDoubleTap = ({ nativeEvent }: { nativeEvent: { state: State } }) => {
    if (nativeEvent.state === State.ACTIVE) {
      let nextState: 'default' | 'lower' | 'top';
      let targetTranslateY;

      switch (panelState) {
        case 'default':
          nextState = 'lower';
          targetTranslateY = lowerSnapPoint;
          break;
        case 'lower':
          nextState = 'top';
          targetTranslateY = topSnapPoint;
          break;
        case 'top':
        default:
          nextState = 'default';
          targetTranslateY = defaultSnapPoint;
          break;
      }

      setPanelState(nextState);
      translateY.value = withSpring(targetTranslateY);
    }
  };

  // Animated gesture handler for dragging
  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, GestureContext>({
    onStart: (event, ctx) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      // Limit dragging within bounds (distance from top)
      const newTranslateY = ctx.startY + event.translationY;
      translateY.value = Math.max(topSnapPoint, Math.min(newTranslateY, maxTranslateY)); // Limit between topSnapPoint and maxTranslateY
    },
    onEnd: (event, ctx) => {
      // Optional: Add snapping logic here based on the final position after drag ends
      // For now, it just stops where the drag ends.
    },
  });

  // Animated style for the draggable panel
  const panelAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value }
      ],
      // Height will be determined by flex: 1 and translateY
      // We need to set top: 0 in the base style and then translateY moves it down
    };
  });

  // Animated style for the scrollable content container
  const contentContainerAnimatedStyle = useAnimatedStyle(() => {
    // Calculate the height available for the content below the header,
    // considering the panel's current translateY position.
    // We subtract headerHeight because the content starts below the header.
    const availableHeight = screenHeight - translateY.value - headerHeight;
    return {
      height: availableHeight > 0 ? availableHeight : 0, // Ensure height is not negative
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className={`flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />

        {/* Active Map as background */}
        <MapView
          ref={mapRef} // Assign ref
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 4.2,
            longitude: 102.0,
            latitudeDelta: 5.5,
            longitudeDelta: 5.5,
          }}
        >
          {selectedFlightCoords?.origin && (
            <Marker coordinate={selectedFlightCoords.origin} />
          )}
          {selectedFlightCoords?.destination && (
            <Marker coordinate={selectedFlightCoords.destination} />
          )}
          {selectedFlightCoords?.origin && selectedFlightCoords?.destination && (
            <Polyline
              coordinates={[
                selectedFlightCoords.origin,
                selectedFlightCoords.destination,
              ]}
              strokeColor="#000" // Black
              strokeColors={['#4ade80', '#f87171']} // Optional: gradient stroke
              strokeWidth={3}
            />
          )}
        </MapView>

        {/* Draggable Panel */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: theme === 'dark' ? 'black' : 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 16, flex: 1, flexDirection: 'column' },
              panelAnimatedStyle
            ]}
          >
            {/* Tappable Header (Double Tap) */}
            <TapGestureHandler
              numberOfTaps={2}
              onHandlerStateChange={handleDoubleTap}
            >
              <View>
                <ListHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} onLayout={handleHeaderLayout} />
              </View>
            </TapGestureHandler>

            <Animated.View style={[{ flex: 1 }, contentContainerAnimatedStyle]}>
              {loading ? (
                <View className="items-center mt-4 mx-4 mb-4">
                  <View className="flex-row items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
                    <ActivityIndicator size="large" color={theme === 'dark' ? 'white' : 'black'} />
                    <Text className={`ml-2 text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Please stand by...</Text>
                  </View>
                </View>
              ) : error ? (
                <View className="flex-1 justify-center items-center p-4">
                  <Text className={`text-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{error}</Text>
                </View>
              ) : (
                <FlightList searchQuery={searchQuery} flights={flights} onPress={handleFlightPress} onShare={handleShare} />
              )}
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
}