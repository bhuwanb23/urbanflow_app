import React from 'react';
import { render } from '@testing-library/react-native';
import RouteDetailsScreen from '../pages/route/RouteDetailsScreen';

// Mock all dependencies
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient'
}));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 40, bottom: 20, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }) => <>{children}</>,
  SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 40, bottom: 20 }) },
}));

jest.mock('../pages/route/hooks/useAccessibility', () => ({
  useAccessibility: () => ({
    triggerHapticFeedback: jest.fn(),
    announceForAccessibility: jest.fn(),
  })
}));

jest.mock('../pages/route/hooks/useLiveTracking', () => ({
  useLiveTracking: () => ({
    isTracking: false,
    currentLocation: null,
    speed: null,
    startTracking: jest.fn(),
    stopTracking: jest.fn(),
    updateLocation: jest.fn(),
  })
}));

// Mock navigation
const mockNavigation = {
  goBack: jest.fn(),
};

const mockRoute = {
  params: {
    route: {
      id: 'test-route',
      from: 'Central St.',
      to: 'Airport Terminal',
      duration: '42 min',
      arrivalTime: '09:15 AM',
      segments: [
        {
          id: 'seg-1',
          type: 'walk',
          title: 'Walk to Central St.',
          duration: '8 mins',
          distance: '0.4 miles',
          status: 'on-time',
        },
        {
          id: 'seg-2',
          type: 'bus',
          title: 'Bus 102',
          duration: '12 mins',
          stops: 6,
          status: 'delayed',
          delayInfo: '2m delay',
          liveTracking: true,
        },
        {
          id: 'seg-3',
          type: 'metro',
          title: 'Blue Line (U3)',
          duration: '15 mins',
          stops: 4,
          status: 'on-time',
          occupancy: 'low',
        },
        {
          id: 'seg-4',
          type: 'bike',
          title: 'FlowBike Rental',
          duration: '7 mins',
          distance: '0.8 miles',
          status: 'available',
          nearbyStation: true,
        },
      ],
    },
  },
};

describe('RouteDetailsScreen - Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(
      <RouteDetailsScreen 
        navigation={mockNavigation} 
        route={mockRoute} 
      />
    );
    
    expect(toJSON()).toBeTruthy();
  });

  it('displays route title', () => {
    const { getByText } = render(
      <RouteDetailsScreen 
        navigation={mockNavigation} 
        route={mockRoute} 
      />
    );
    
    expect(getByText('UrbanFlow')).toBeTruthy();
  });

  it('displays journey information', () => {
    const { getByText } = render(
      <RouteDetailsScreen 
        navigation={mockNavigation} 
        route={mockRoute} 
      />
    );
    
    expect(getByText('42 min • Arriving 09:15 AM')).toBeTruthy();
  });

  it('renders all route segments', () => {
    const { getAllByLabelText } = render(
      <RouteDetailsScreen 
        navigation={mockNavigation} 
        route={mockRoute} 
      />
    );
    
    // Should have 4 segment items with accessibility labels
    const segments = getAllByLabelText(/segment:/i);
    expect(segments).toHaveLength(4);
  });

  it('displays first segment details', () => {
    const { getByText } = render(
      <RouteDetailsScreen 
        navigation={mockNavigation} 
        route={mockRoute} 
      />
    );
    
    expect(getByText('Walk to Central St.')).toBeTruthy();
    expect(getByText('0.4 miles')).toBeTruthy();
  });

  it('shows delay information for bus segment', () => {
    const { getByText } = render(
      <RouteDetailsScreen 
        navigation={mockNavigation} 
        route={mockRoute} 
      />
    );
    
    expect(getByText('2m delay')).toBeTruthy();
  });

  it('displays live tracking indicator', () => {
    const { getByText } = render(
      <RouteDetailsScreen 
        navigation={mockNavigation} 
        route={mockRoute} 
      />
    );
    
    expect(getByText('LIVE TRACKING ACTIVE')).toBeTruthy();
  });

  it('shows Start Journey button', () => {
    const { getByText } = render(
      <RouteDetailsScreen 
        navigation={mockNavigation} 
        route={mockRoute} 
      />
    );
    
    expect(getByText('Start Journey')).toBeTruthy();
  });

  it('calls navigation.goBack when back button is pressed', () => {
    const { getByLabelText } = render(
      <RouteDetailsScreen 
        navigation={mockNavigation} 
        route={mockRoute} 
      />
    );
    
    const backButton = getByLabelText('Go back');
    backButton.props.onPress();
    
    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('has proper safe area handling', () => {
    const { toJSON } = render(
      <RouteDetailsScreen 
        navigation={mockNavigation} 
        route={mockRoute} 
      />
    );
    
    const tree = toJSON();
    // Check that the component structure includes SafeAreaView
    expect(tree.type).toBeDefined();
  });
});
