import * as Notifications from 'expo-notifications';
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

// Configure notification handling for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

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

  // --- Notification Queue Logic ---
  const [notificationQueue, setNotificationQueue] = useState<{ title: string; body: string }[]>([]);
  const isProcessingQueue = useRef(false);
  const notificationDelayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const simulationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // ---

  // State for manual toggle of Dubai flight status (removing this, as all will be random)
  // const [dubaiFlightStatus, setDubaiFlightStatus] = useState<'Landed' | 'Gate Changed'>('Landed');

  // Shared value for the panel's vertical position (distance from top)
  const translateY = useSharedValue(defaultSnapPoint);

  // State to manage panel snap position (for toggling)
  const [panelState, setPanelState] = useState<'default' | 'lower' | 'top'>('default'); // 'default', 'lower', 'top'

  // Store the starting position when the gesture begins
  const context = useSharedValue<GestureContext>({ startY: 0 });

  useEffect(() => {
    // Use dummy data initially
    setFlights(dummyFlights); // Start with original dummy data
    setLoading(false);

    // Request notification permissions
    registerForPushNotificationsAsync();

    // Cleanup function
    return () => {
      const currentInterval = simulationIntervalRef.current;
      const currentTimer = notificationDelayTimer.current;
      
      if (currentInterval) {
        clearInterval(currentInterval);
      }
      if (currentTimer) {
        clearTimeout(currentTimer);
      }
    };
  }, []);

  // Toggle simulation function
  const toggleSimulation = () => {
    if (isSimulationActive) {
      // Stop simulation
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }
      setIsSimulationActive(false);
      console.log('Simulation stopped');
    } else {
      // Start simulation
      console.log('Simulation started');
      setIsSimulationActive(true);
      
      const updateInterval = setInterval(() => {
        console.log('Simulating flight data update...');
        
        setFlights(prevFlights => {
          const notificationsToAdd: { title: string; body: string }[] = [];
          
          const updatedFlights = prevFlights.map(flight => {
            // Create a copy of the flight to potentially modify
            let updatedFlight = { ...flight };
            
            // Simulate random status changes for all flights
            if (flight.id === '1' && Math.random() > 0.7) { // Malaysia Airlines - On Time/Delayed
              const statuses: Flight['status'][] = ['On Time', 'Delayed'];
              const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
              if (randomStatus !== flight.status) {
                console.log(`Simulating status change for ${flight.flightNumber}: ${flight.status} -> ${randomStatus}`);
                updatedFlight.status = randomStatus;
              }
            }
            
            if (flight.id === '2' && Math.random() > 0.5) { // AirAsia - Delayed/Canceled/On Time
              const statuses: Flight['status'][] = ['Delayed', 'Canceled', 'On Time'];
              const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
              if (randomStatus !== flight.status) {
                console.log(`Simulating status change for ${flight.flightNumber}: ${flight.status} -> ${randomStatus}`);
                updatedFlight.status = randomStatus;
              }
            }
            
            if (flight.id === '3' && Math.random() > 0.6) { // Singapore Airlines - On Time/Delayed/Departed
              const statuses: Flight['status'][] = ['On Time', 'Delayed', 'Departed'];
              const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
              if (randomStatus !== flight.status) {
                console.log(`Simulating status change for ${flight.flightNumber}: ${flight.status} -> ${randomStatus}`);
                updatedFlight.status = randomStatus;
              }
            }
            
            if (flight.id === '4' && Math.random() > 0.6) { // Emirates - Landed/Gate Changed
              const statuses: Flight['status'][] = ['Landed', 'Gate Changed'];
              const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
              if (randomStatus !== flight.status) {
                console.log(`Simulating status change for ${flight.flightNumber}: ${flight.status} -> ${randomStatus}`);
                updatedFlight.status = randomStatus;
                // When changing to Gate Changed, also simulate a gate update
                if (randomStatus === 'Gate Changed') {
                  updatedFlight.destination = { ...updatedFlight.destination, gate: 'A2' };
                }
              }
            }
            
            if (flight.id === '5' && Math.random() > 0.8) { // Batik Air - On Time/Delayed/Departed
              const statuses: Flight['status'][] = ['On Time', 'Delayed', 'Departed'];
              const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
              if (randomStatus !== flight.status) {
                console.log(`Simulating status change for ${flight.flightNumber}: ${flight.status} -> ${randomStatus}`);
                updatedFlight.status = randomStatus;
              }
            }
            
            // Check if status changed and add notification
            if (flight.status !== updatedFlight.status) {
              let notificationBody = `Status changed from ${flight.status} to ${updatedFlight.status}.`;
              // Special gate logic for Dubai flight notification body
              if (updatedFlight.id === '4' && updatedFlight.status === 'Gate Changed') {
                notificationBody += ` Gate: A2`;
              }

              notificationsToAdd.push({
                title: `Flight ${updatedFlight.airline} ${updatedFlight.flightNumber} Status Change`,
                body: notificationBody,
              });
            }
            
            return updatedFlight;
          });

          // Only send one notification per interval to avoid multiple banners
          if (notificationsToAdd.length > 0) {
            // Priority order: Canceled > Gate Changed > Delayed > Departed > On Time
            const priorityOrder = ['Canceled', 'Gate Changed', 'Delayed', 'Departed', 'On Time'];
            const sortedNotifications = notificationsToAdd.sort((a, b) => {
              const aStatus = a.body.split(' to ')[1]?.split('.')[0] || '';
              const bStatus = b.body.split(' to ')[1]?.split('.')[0] || '';
              const aPriority = priorityOrder.indexOf(aStatus);
              const bPriority = priorityOrder.indexOf(bStatus);
              return (aPriority === -1 ? 999 : aPriority) - (bPriority === -1 ? 999 : bPriority);
            });
            
            // Only add the highest priority notification to the queue
            setNotificationQueue(prevQueue => [...prevQueue, sortedNotifications[0]]);
          }

          return updatedFlights;
        });

      }, 7000); // Check for updates every 7 seconds

      simulationIntervalRef.current = updateInterval;
    }
  };

  // --- Effect to process notification queue sequentially ---
  useEffect(() => {
    const processQueue = async () => {
      if (notificationQueue.length > 0 && !isProcessingQueue.current) {
        isProcessingQueue.current = true;
        const nextNotification = notificationQueue[0];

        // Send the notification
        await sendNotification(nextNotification.title, nextNotification.body);

        // Wait for 5 seconds before processing the next one
        notificationDelayTimer.current = setTimeout(() => {
          setNotificationQueue(prevQueue => prevQueue.slice(1)); // Remove the sent notification
          isProcessingQueue.current = false;
        }, 5000); // 5-second delay between notifications
      }
    };

    processQueue();

  }, [notificationQueue]); // Rerun effect when queue changes
  // ---

  // Function to manually toggle Dubai flight status (removing this)
  // const toggleDubaiFlightStatus = () => {
  //   setFlights(prevFlights => {
  //       const currentFlights = [...prevFlights];
  //       const dubaiFlightIndex = currentFlights.findIndex(f => f.id === '4');
        
  //       if (dubaiFlightIndex === -1) return prevFlights; // Should not happen with dummy data

  //       const currentDubaiFlight = currentFlights[dubaiFlightIndex];
  //       const previousStatus = currentDubaiFlight.status;
  //       const newStatus = previousStatus === 'Landed' ? 'Gate Changed' : 'Landed';

  //       const updatedDubaiFlight = { ...currentDubaiFlight, status: newStatus as Flight['status'] };

  //       // Simulate gate update if changing to Gate Changed
  //       if (newStatus === 'Gate Changed') {
  //          updatedDubaiFlight.destination = { ...updatedDubaiFlight.destination!, gate: 'A4' };
  //       }

  //       currentFlights[dubaiFlightIndex] = updatedDubaiFlight;

  //       // Trigger notification for the manual change (add to queue instead)
  //       let notificationBody = `Status changed from ${previousStatus} to ${newStatus}.`;
  //       if (newStatus === 'Gate Changed') {
  //           notificationBody += ` Gate: A2`;
  //       }
  //       // Add to queue
  //       setNotificationQueue(prevQueue => [...prevQueue, {
  //           title: `Flight ${updatedDubaiFlight.airline} ${updatedDubaiFlight.flightNumber} Status Change`,
  //           body: notificationBody,
  //       }]);

  //       setDubaiFlightStatus(newStatus as 'Landed' | 'Gate Changed'); // Update manual toggle state (remove this)
  //       return currentFlights; // Update flights state
  //   });
  // };

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

  // Function to request permissions and get Expo push token
  async function registerForPushNotificationsAsync() {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Permission required', 'Please grant push notification permissions to receive flight updates!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    // In a real app, you would send this token to your backend server
  }

  // Function to send a local notification
  async function sendNotification(title: string, body: string) {
    const schedulingOptions = {
      content: {
        title: title,
        body: body,
        icon: 'asset://assets/airlines/airasiax.png', // Add AirAsia X icon - Note: Might not work in Expo Go
      },
      trigger: null, // Send immediately
    };
    await Notifications.scheduleNotificationAsync(schedulingOptions);
  }

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
                <ListHeader 
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery} 
                  onLayout={handleHeaderLayout} 
                  currentPanelState={panelState}
                  isSimulationActive={isSimulationActive}
                  onToggleSimulation={toggleSimulation}
                />
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

