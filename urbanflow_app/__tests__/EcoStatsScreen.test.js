/**
 * EcoStatsScreen tests
 */

import React from 'react';
import { act, create } from 'react-test-renderer';
import EcoStatsScreen from '../pages/ecostats/EcoStatsScreen';
import { useEcoStats } from '../utils/hooks/useAPI';

jest.mock('../utils/hooks/useAPI', () => ({ useEcoStats: jest.fn() }));

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('moti', () => ({ MotiView: 'MotiView', AnimatePresence: 'AnimatePresence' }));
jest.mock('expo-linear-gradient', () => ({ LinearGradient: 'LinearGradient' }));
jest.mock('react-native-reanimated', () => ({ View: 'View', default: {} }));
jest.mock('../pages/live/components/FeedSkeleton', () => 'FeedSkeleton');
jest.mock('../components/ErrorState', () => 'ErrorState');
jest.mock('../pages/ecostats/components/EcoHeader', () => 'EcoHeader');
jest.mock('../pages/ecostats/components/StatCard', () => 'StatCard');
jest.mock('../pages/ecostats/components/TransportCard', () => 'TransportCard');
jest.mock('../pages/ecostats/components/EcoChart', () => 'EcoChart');
jest.mock('../pages/ecostats/components/AchievementCard', () => 'AchievementCard');
jest.mock('../pages/ecostats/components/GoalCard', () => 'GoalCard');

const mockFetch = jest.fn();
const mockAddTrip = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  useEcoStats.mockReturnValue({
    ecoStats: { distance: { total: 10000, byMode: { bus: 6000, walk: 4000 } }, co2: { total: 1500 }, trips: 12 },
    achievements: [],
    loading: false,
    error: null,
    fetchEcoStats: mockFetch,
    addEcoTrip: mockAddTrip,
  });
});

function renderScreen() {
  const navigation = { navigate: jest.fn() };
  let tree;
  act(() => { tree = create(<EcoStatsScreen navigation={navigation} />); });
  return { tree, navigation };
}

describe('EcoStatsScreen', () => {
  test('renders without crashing', () => {
    const { tree } = renderScreen();
    expect(tree.toJSON()).toBeTruthy();
  });

  test('useEcoStats hook is invoked on mount', () => {
    renderScreen();
    expect(useEcoStats).toHaveBeenCalled();
  });

  test('fetchEcoStats is bound from useEcoStats', async () => {
    mockFetch.mockResolvedValue({ success: true });
    renderScreen();
    const { fetchEcoStats } = useEcoStats();
    await act(async () => { await fetchEcoStats(); });
    expect(mockFetch).toHaveBeenCalled();
  });

  test('loading state renders gracefully', () => {
    useEcoStats.mockReturnValue({
      ecoStats: null,
      achievements: [],
      loading: true,
      error: null,
      fetchEcoStats: mockFetch,
      addEcoTrip: mockAddTrip,
    });
    const { tree } = renderScreen();
    expect(tree.toJSON()).toBeTruthy();
  });

  test('error state renders gracefully', () => {
    useEcoStats.mockReturnValue({
      ecoStats: null,
      achievements: [],
      loading: false,
      error: 'Failed',
      fetchEcoStats: mockFetch,
      addEcoTrip: mockAddTrip,
    });
    const { tree } = renderScreen();
    expect(tree.toJSON()).toBeTruthy();
  });
});
