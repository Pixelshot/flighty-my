import { Stack } from 'expo-router';
import React from 'react';
import "./global.css"; // Import global CSS for Tailwind

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
