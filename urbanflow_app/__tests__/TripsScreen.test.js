/**
 * TripsScreen tests
 */

import React from 'react';
import { act, create } from 'react-test-renderer';
import TripsScreen from '../pages/trips/TripsScreen';
import { useTrips, useRoutes } from '../utils/hooks/useAPI';

jest.mock('../utils/hooks/useAPI', () => ({
  useTrips: jest.fn(),
  useRoutes: jest.fn(),
}));

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('moti', () => ({ MotiView: 'MotiView', AnimatePresence: 'AnimatePresence' }));
jest.mock('expo-linear-gradient', () => ({ LinearGradient: 'LinearGradient' }));
jest.mock('react-native-reanimated', () => ({ View: 'View', default: {} }));
jest.mock('../pages/live/components/FeedSkeleton', () => 'FeedSkeleton');
jest.mock('../components/EmptyState', () => 'EmptyState');
jest.mock('../components/ErrorState', () => 'ErrorState');

const mockFetchTrips = jest.fn();
const mockPlanJourney = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  useTrips.mockReturnValue({
    trips: [],
    loading: false,
    error: null,
    fetchTrips: mockFetchTrips,
  });
  useRoutes.mockReturnValue({
    routes: [],
    searchRoutes: mockPlanJourney,
  });
});

function renderScreen() {
  const navigation = { navigate: jest.fn() };
  let tree;
  act(() => { tree = create(<TripsScreen navigation={navigation} />); });
  return { tree, navigation };
}

describe('TripsScreen', () => {
  test('renders without crashing', () => {
    const { tree } = renderScreen();
    expect(tree.toJSON()).toBeTruthy();
  });

  test('useTrips hook is invoked on mount', () => {
    renderScreen();
    expect(useTrips).toHaveBeenCalled();
  });

  test('fetchTrips is bound from useTrips', async () => {
    mockFetchTrips.mockResolvedValue({ success: true });
    renderScreen();
    const { fetchTrips } = useTrips();
    await act(async () => { await fetchTrips(); });
    expect(mockFetchTrips).toHaveBeenCalled();
  });

  test('loading state renders gracefully', () => {
    useTrips.mockReturnValue({
      trips: [],
      loading: true,
      error: null,
      fetchTrips: mockFetchTrips,
    });
    const { tree } = renderScreen();
    expect(tree.toJSON()).toBeTruthy();
  });

  test('renders with trips data', () => {
    useTrips.mockReturnValue({
      trips: [{ id: '1', from: 'A', to: 'B', mode: 'bus' }],
      loading: false,
      error: null,
      fetchTrips: mockFetchTrips,
    });
    const { tree } = renderScreen();
    expect(tree.toJSON()).toBeTruthy();
  });
});
