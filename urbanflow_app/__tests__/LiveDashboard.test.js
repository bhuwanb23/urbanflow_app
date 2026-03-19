import React from 'react';
import { render } from '@testing-library/react-native';
import LiveDashboard from '../pages/live/components/LiveDashboard';

// Mock dependencies
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('moti', () => ({
  MotiView: 'MotiView'
}));

describe('LiveDashboard', () => {
  it('renders correctly', () => {
    const { getByText } = render(<LiveDashboard />);
    
    // Check if main sections are rendered
    expect(getByText('SYSTEM STATUS')).toBeTruthy();
    expect(getByText('Metropolitan Core')).toBeTruthy();
    expect(getByText('LIVE INSIGHTS')).toBeTruthy();
    expect(getByText('AIR QUALITY INDEX')).toBeTruthy();
    expect(getByText('TRAFFIC LOAD')).toBeTruthy();
    expect(getByText('ACTIVE ALERTS')).toBeTruthy();
    expect(getByText('TRANSIT CAP.')).toBeTruthy();
    expect(getByText('Real-Time Activity')).toBeTruthy();
  });
});
