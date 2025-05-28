# Flighty App Clone (React Native)

This project is a React Native application aiming to clone the core user interface and features of the Flighty app. It utilizes Expo, NativeWind for styling, and TypeScript.

## App Preview

### Main Screen (Dark Mode)
![Main Screen Dark](./screenshots/dark-main.png)

### Search Filtering (Light Mode)
![Search Filtering Light](./screenshots/light-search.png)

### Main Screen (Light Mode)
![Main Screen Light](./screenshots/light-main.png)

### Map Focus (Dark Mode)
![Map Focus Dark](./screenshots/dark-map.png)

## Project Overview

The goal is to replicate the flight tracking experience provided by Flighty, focusing on a clean, intuitive UI and real-time flight status updates (though currently using dummy data).

## Current Status (As of May 27, 2025)

- **Core UI Structure:**
  - Main flight list screen established using Expo Router for navigation.
  - **Map background** on the main screen using `react-native-maps`, centered on Peninsular Malaysia by default.
  - **Draggable panel** overlays the map, containing the flight list and header. The panel can be dragged up and down, with snap points and a default position.
  - Custom header component (`ListHeader`) with title, placeholder icons, and a search bar.
  - Flight list display (`FlightList` & `FlightItem`) showing individual flight cards.
- **Flight Item Cards:**
  - Detailed layout with two columns: time-to-event on the left, and flight details on the right.
  - Flight details include airline (with placeholder icon), flight number, origin/destination cities, scheduled times with airport codes (using `airplane-takeoff` and `airplane-landing` icons), and flight status.
  - Conditional styling for flight status text (e.g., "Delayed" in red, "Landed" in blue, "On Time" in green).
  - Conditional coloring for takeoff/landing icons based on flight status (e.g., red for delayed flights).
- **Styling:**
  - NativeWind is used for all styling, providing a Tailwind CSS-like experience.
  - Basic card styling (background, padding, shadow) and text styling applied.
- **Data Handling:**
  - Dummy flight data (`data/flights.ts`) is used to populate the list.
  - Includes a `Flight` interface defining the data structure.
  - Utility function (`utils/timeUtils.ts`) for time formatting.
- **Dark Mode:**
  - Implemented a theme context (`context/ThemeContext.tsx`) using NativeWind's `useColorScheme` and React Native's `Appearance` module.
  - Dark mode can be toggled via a Switch in the header.
  - Styles for dark mode applied to the main screen, header, and flight item cards.
- **Search Functionality:**
  - The search bar in the header now filters the flight list in real time.
- **Draggable Panel:**
  - The flight list is displayed inside a draggable panel that overlays the map, implemented using `react-native-reanimated` and `react-native-gesture-handler`.
  - The panel starts at a default snap point and can be dragged up or down within set bounds.
- **Dependency Management & Troubleshooting:**
  - Resolved significant Metro bundler and dependency version conflicts using `npm install --legacy-peer-deps` and `npx expo-doctor`.
  - Addressed various linter and rendering issues, including problems with NativeWind class application and component duplication.

## Setup and Running the Project

1.  **Install Dependencies:**
    ```bash
    npm install
    expo install react-native-maps
    expo install react-native-reanimated react-native-gesture-handler
    ```
    (If you encounter peer dependency issues, you might need to use `npm install --legacy-peer-deps`)

2.  **Start the Development Server:**
    ```bash
    npx expo start
    ```
    You can then open the app in an iOS simulator/Android emulator or on a physical device using the Expo Go app.

3.  **Map Configuration:**
    - The map uses `react-native-maps` and is centered on Peninsular Malaysia by default.
    - For production, you may need to set up API keys for Google Maps or Mapbox and configure permissions as per the [react-native-maps documentation](https://github.com/react-native-maps/react-native-maps).

## Next Steps & Potential Future Tasks

- **Refine Icons & Styling:**
  - Replace placeholder airline logo characters with actual airline logos (e.g., SVG or dynamic image loading).
  - Further refine UI details and spacing to more closely match the Flighty app aesthetic.
  - Polish dark mode colors and ensure consistency across all elements.
- **Flight Details Screen:**
  - Create a new screen to show more detailed information when a flight card is tapped.
  - Implement navigation to this details screen.
- **Real Data Integration:**
  - Replace dummy data with a real-time flight status API.
- **Advanced Features (Long Term):**
  - Live flight tracking on a map.
  - Push notifications for flight status changes.
  - User accounts and saved flights.
  - Calendar integration.
- **Code Cleanup & Optimization:**
  - Refactor components as needed.
  - Optimize performance, especially for long lists.

---

*This README provides a snapshot of the project's progress. For the most up-to-date information, please refer to the commit history and the code itself.*
