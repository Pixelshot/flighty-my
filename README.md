# Flighty-My - Your Personal Flight Assistant 📱✈️

## **What is Flighty-My? (Simple Explanation)**

Flighty-My is a **flight tracking app** that helps you keep track of flights in real-time. Think of it like a personal assistant that watches your flights for you and tells you everything you need to know about them - all in one place on your phone.

### **✨ Key Features**

**📱 Easy-to-Read Flight Cards**
- See all your flights displayed as simple cards, like having airplane tickets on your phone
- Each card shows the airline, flight number, departure/arrival times, and current status

**🗺️ Interactive Map**
- A beautiful map showing where flights are going
- You can see the route between cities when you select a flight

**🔍 Smart Search**
- Quickly find any flight by typing the airline name, flight number, or destination
- No more scrolling through long lists

**🌙 Dark & Light Mode**
- Switch between bright (day) and dark (night) themes
- Easy on your eyes whether you're using it during the day or at night

**📊 Real-Time Status Updates**
- Instantly see if your flight is "On Time," "Delayed," "Departed," or "Landed"
- Color-coded status (green for on-time, red for delayed, etc.)

**📲 Smart Notifications**
- Get alerts about important flight changes
- No need to constantly check the app

### **🎯 Why Use This App?**

**💆‍♀️ Reduces Travel Stress**
- No more anxiety about "Is my flight on time?"
- Everything you need to know is right there

**⏰ Saves Time**
- No need to visit multiple websites or apps
- Quick search finds your flight in seconds

**🎯 Stays Organized**
- All your flights in one place
- Clean, easy-to-read design

**Think of it like having a personal flight attendant in your pocket** - someone who's always watching your flights and will tap you on the shoulder whenever something important happens, so you can relax and focus on your trip instead of worrying about flight details.

Perfect for **anyone who travels** - whether you're a business traveler, going on vacation, or just picking someone up from the airport!

---

## **Technical Overview (For Developers)**

This project is a React Native application built with Expo, aiming to replicate the core user interface and features of the popular Flighty app. It utilizes NativeWind for styling and TypeScript for type safety.

## App Preview

<table>
  <tr>
    <td align="center"><b>Main Screen (Light Mode)</b><br>
      <img src="./screenshots/Main%20Screen%20(Light%20Mode).png" alt="Main Screen Light" width="220"/>
    </td>
    <td align="center"><b>Search Filtering (Light Mode)</b><br>
      <img src="./screenshots/Search%20Filtering%20(Light%20Mode).png" alt="Search Filtering Light" width="220"/>
    </td>
  </tr>
  <tr>
    <td align="center"><b>Main Screen (Dark Mode)</b><br>
      <img src="./screenshots/Main%20Screen%20(Dark%20Mode).png" alt="Main Screen Dark" width="220"/>
    </td>
    <td align="center"><b>Map Focus (Dark Mode)</b><br>
      <img src="./screenshots/Map%20Focus%20(Dark%20Mode).png" alt="Map Focus Dark" width="220"/>
    </td>
  </tr>
</table>

## **Project Overview**

The goal is to replicate the comprehensive flight tracking experience provided by Flighty, focusing on:
- **Clean, intuitive UI** that anyone can use
- **Real-time flight status updates** (currently using demo data)
- **Seamless user experience** across different devices and lighting conditions
- **Modern mobile app performance** with smooth animations and interactions

## **Current Status (As of June 14, 2025)**

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

## **Getting Started (Quick Setup)**

### **For Users**
1. Download the app (when available on app stores)
2. Open the app - no sign-up required!
3. Your demo flights will appear automatically
4. Tap any flight to see more details
5. Use the search bar to find specific flights
6. Toggle dark/light mode using the switch in the header

### **For Developers**

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

## **What's Coming Next?**

### **Immediate Improvements**
- **Real airline logos** instead of placeholder icons
- **Flight details screen** with more comprehensive information
- **Enhanced animations** and smoother interactions

### **Upcoming Features**
- **Live flight tracking** with real airline data
- **Push notifications** for flight status changes
- **Personal flight history** and favorites
- **Airport information** and terminal maps
- **Weather integration** for departure/arrival cities

### **Long-term Vision**
- **User accounts** with personalized flight tracking
- **Calendar integration** for automatic flight detection
- **Sharing features** to keep family/friends updated
- **Offline mode** for viewing saved flights without internet

---

## **Technical Details**

### **Built With Modern Technology**
- **React Native & Expo** - For cross-platform mobile development
- **TypeScript** - For reliable, bug-free code
- **NativeWind** - For beautiful, responsive styling
- **React Native Maps** - For interactive map features
- **Gesture Handler & Reanimated** - For smooth animations

### **Development Setup**

---

*This README provides a snapshot of the project's progress. For the most up-to-date information, please refer to the commit history and the code itself.*
