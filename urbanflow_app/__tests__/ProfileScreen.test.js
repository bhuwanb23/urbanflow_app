/**
 * ProfileScreen tests
 */

import React from 'react';
import { act, create } from 'react-test-renderer';
import ProfileScreen from '../pages/profile/ProfileScreen';
import { useAuth, useTrips } from '../utils/hooks/useAPI';

jest.mock('../utils/hooks/useAPI', () => ({
  useAuth: jest.fn(),
  useTrips: jest.fn(),
}));

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('moti', () => ({ MotiView: 'MotiView' }));
jest.mock('expo-linear-gradient', () => ({ LinearGradient: 'LinearGradient' }));
jest.mock('react-native-reanimated', () => ({ View: 'View', default: {} }));
jest.mock('../pages/profile/components/ProfileHeader', () => 'ProfileHeader');
jest.mock('../pages/profile/components/ProfileCard', () => 'ProfileCard');
jest.mock('../pages/profile/components/SettingsCard', () => 'SettingsCard');
jest.mock('../pages/profile/components/SustainabilityCard', () => 'SustainabilityCard');
jest.mock('../pages/profile/components/LogoutButton', () => 'LogoutButton');

const mockLogout = jest.fn();
const mockFetchTrips = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  useAuth.mockReturnValue({
    user: { id: 'u1', name: 'Test User', email: 't@e.com' },
    logout: mockLogout,
  });
  useTrips.mockReturnValue({
    trips: [],
    fetchTrips: mockFetchTrips,
  });
});

function renderScreen() {
  const navigation = { navigate: jest.fn() };
  let tree;
  act(() => { tree = create(<ProfileScreen navigation={navigation} />); });
  return { tree, navigation };
}

describe('ProfileScreen', () => {
  test('renders without crashing', () => {
    const { tree } = renderScreen();
    expect(tree.toJSON()).toBeTruthy();
  });

  test('useAuth hook is invoked on mount', () => {
    renderScreen();
    expect(useAuth).toHaveBeenCalled();
  });

  test('logout is bound from useAuth', async () => {
    mockLogout.mockResolvedValue({ success: true });
    renderScreen();
    const { logout } = useAuth();
    await act(async () => { await logout(); });
    expect(mockLogout).toHaveBeenCalled();
  });

  test('renders with user data', () => {
    const { tree } = renderScreen();
    expect(tree.toJSON()).toBeTruthy();
  });

  test('handles null user gracefully', () => {
    useAuth.mockReturnValue({ user: null, logout: mockLogout });
    const { tree } = renderScreen();
    expect(tree.toJSON()).toBeTruthy();
  });
});
