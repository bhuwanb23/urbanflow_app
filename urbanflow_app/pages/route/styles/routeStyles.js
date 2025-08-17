import { StyleSheet } from 'react-native';

export const routeStyles = StyleSheet.create({
  scrollContent: { 
    padding: 20, 
    paddingBottom: 80,
    gap: 16, // Add consistent spacing between components
  },
  // Component spacing utilities
  componentSpacing: {
    marginBottom: 16,
  },
  // Safe area utilities
  safeAreaTop: {
    paddingTop: 8,
  },
  safeAreaBottom: {
    paddingBottom: 20,
  },
  // Add any additional styles that might be needed across components
});
