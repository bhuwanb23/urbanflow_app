import { useColorScheme } from 'react-native';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';

const THEME_STORAGE_KEY = '@urbanflow_theme_mode';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#16a34a',
    secondary: '#10b981',
    accent: '#34d399',
    background: '#f8f9fa',
    surface: '#f8f9fa',
    onSurface: '#191c1d',
    surfaceContainer: '#edeeef',
    surfaceContainerLow: '#f3f4f5',
    surfaceContainerHigh: '#e7e8e9',
    surfaceContainerHighest: '#e1e3e4',
    surfaceVariant: '#e1e3e4',
    onSurfaceVariant: '#3e4a3d',
    outline: '#6e7b6c',
    outlineVariant: '#bdcaba',
    elevation: { ...MD3LightTheme.colors.elevation, level0: '#f8f9fa' },
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#4ade80',
    secondary: '#34d399',
    accent: '#6ee7b7',
    background: '#0f172a',
    surface: '#1e293b',
    onSurface: '#f1f5f9',
    surfaceContainer: '#1e293b',
    surfaceContainerLow: '#1a2332',
    surfaceContainerHigh: '#253348',
    surfaceContainerHighest: '#2d3d55',
    surfaceVariant: '#2d3d55',
    onSurfaceVariant: '#cbd5e1',
    outline: '#64748b',
    outlineVariant: '#334155',
    elevation: { ...MD3DarkTheme.colors.elevation, level0: '#0f172a' },
  },
};

export function useAppTheme() {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
      if (stored) setThemeMode(stored);
    });
  }, []);

  const isDark = useMemo(() => {
    if (themeMode === 'system') return systemScheme === 'dark';
    return themeMode === 'dark';
  }, [themeMode, systemScheme]);

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => {
      const modes = ['system', 'light', 'dark'];
      const idx = modes.indexOf(prev);
      const next = modes[(idx + 1) % modes.length];
      AsyncStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { isDark, theme, themeMode, toggleTheme };
}
