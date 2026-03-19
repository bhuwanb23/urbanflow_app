import React from 'react';
import { render } from '@testing-library/react-native';
import TopAppBar from '../pages/route/components/TopAppBar';

// Mock dependencies
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient'
}));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 40, bottom: 0, left: 0, right: 0 })
}));
jest.mock('../pages/route/hooks/useAccessibility', () => ({
  useAccessibility: () => ({
    triggerHapticFeedback: jest.fn(),
    announceForAccessibility: jest.fn(),
  })
}));

describe('TopAppBar', () => {
  const mockOnBack = jest.fn();
  const mockOnStartJourney = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default title', () => {
    const { getByText } = render(
      <TopAppBar 
        onBack={mockOnBack} 
        onStartJourney={mockOnStartJourney} 
      />
    );
    
    expect(getByText('UrbanFlow')).toBeTruthy();
  });

  it('renders with custom title', () => {
    const { getByText } = render(
      <TopAppBar 
        onBack={mockOnBack} 
        onStartJourney={mockOnStartJourney}
        title="Route Details"
      />
    );
    
    expect(getByText('Route Details')).toBeTruthy();
  });

  it('calls onBack when back button is pressed', () => {
    const { getByLabelText } = render(
      <TopAppBar 
        onBack={mockOnBack} 
        onStartJourney={mockOnStartJourney} 
      />
    );
    
    const backButton = getByLabelText('Go back');
    backButton.props.onPress();
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('calls onStartJourney when start button is pressed', () => {
    const { getByText } = render(
      <TopAppBar 
        onBack={mockOnBack} 
        onStartJourney={mockOnStartJourney} 
      />
    );
    
    const startButton = getByText('Start Journey');
    startButton.props.onPress();
    
    expect(mockOnStartJourney).toHaveBeenCalledTimes(1);
  });

  it('has accessibility labels', () => {
    const { getByLabelText } = render(
      <TopAppBar 
        onBack={mockOnBack} 
        onStartJourney={mockOnStartJourney} 
      />
    );
    
    expect(getByLabelText('Go back')).toBeTruthy();
    expect(getByLabelText('Start journey')).toBeTruthy();
  });
});
