import { useColorScheme } from 'nativewind';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  // Explicitly add systemTheme for clarity if needed, though not directly used by toggleTheme
  // systemTheme: 'light' | 'dark' | null | undefined;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colorScheme, setColorScheme } = useColorScheme(); // from nativewind
  // Initialize state from NativeWind's colorScheme, defaulting to 'light'
  const [theme, setTheme] = useState<'light' | 'dark'>(colorScheme || 'light');

  // Sync local theme state if NativeWind's colorScheme changes (e.g., from OS change)
  useEffect(() => {
    setTheme(colorScheme || 'light');
  }, [colorScheme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme); // Update local state
    setColorScheme(newTheme); // Update NativeWind's and effectively the class on root
  };

  // Listener for OS-level appearance changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: osColorScheme }) => {
      // When OS theme changes, update NativeWind's scheme, which then updates our local theme via the other useEffect
      setColorScheme(osColorScheme || 'light');
    });
    return () => subscription.remove();
  }, [setColorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 