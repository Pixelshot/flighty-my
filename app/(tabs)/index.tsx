import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Share, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import FlightList from "../../components/FlightList";
import ListHeader from "../../components/ListHeader";
import { useTheme } from "../../context/ThemeContext";
import { Flight, dummyFlights } from "../../data/flights";
// import { fetchFlights } from "../../services/flightService"; // Comment out fetchFlights import

const { height: screenHeight } = Dimensions.get('window');
const panelHeight = screenHeight * 0.95; // Increased panel height
const initialSnapPoint = 0; // Panel at the bottom (not used for initial position now)
// const middleSnapPoint = -screenHeight * 0.4; // Roughly half way up
const topSnapPoint = panelHeight - 760; // Top of panel 100 units from screen top
const lowerSnapPoint = (panelHeight - 100); // Allow panel to be dragged down near the bottom of the screen
const defaultSnapPoint = panelHeight - 360; // The desired default/initial position

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

  // Shared value for the panel's vertical position
  const translateY = useSharedValue(defaultSnapPoint);

  // State to manage panel snap position
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

  // Function to handle header press for toggling
  const handleHeaderPress = () => {
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
  };

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
      // Optional: Set panelState based on final position after drag ends
    },
  });

  // Animated style for the draggable panel
  const panelAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value }
      ],
      height: panelHeight, // Keep fixed height
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
              { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: theme === 'dark' ? 'black' : 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 16, flex: 1, flexDirection: 'column' },
              panelAnimatedStyle
            ]}
          >
            {/* Tappable Header */}
            <TouchableOpacity onPress={handleHeaderPress} activeOpacity={0.8}>
              <ListHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
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
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
}