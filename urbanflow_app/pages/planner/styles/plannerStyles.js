import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const plannerStyles = StyleSheet.create({
  scrollContent: {
    padding: width * 0.05,
    paddingBottom: 80,
  },
  // Add any additional styles that might be needed across components
});
