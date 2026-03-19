import React from 'react';
import { render } from '@testing-library/react-native';
import RouteHeader from '../pages/route/components/RouteHeader';

// Mock dependencies
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient'
}));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 40, bottom: 0, left: 0, right: 0 })
}));

describe('RouteHeader', () => {
  it('renders correctly', () => {
    const mockOnBack = jest.fn();
    const mockOnMenu = jest.fn();
    
    const { getByText } = render(
      <RouteHeader onBack={mockOnBack} onMenu={mockOnMenu} />
    );
    
    expect(getByText('Route Details')).toBeTruthy();
  });
});
