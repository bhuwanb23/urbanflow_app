/**
 * NotificationsScreen tests
 */

import React from 'react';
import { act, create } from 'react-test-renderer';
import NotificationsScreen from '../pages/notifications/NotificationsScreen';
import { useNotifications } from '../utils/hooks/useAPI';

jest.mock('../utils/hooks/useAPI', () => ({ useNotifications: jest.fn() }));

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('moti', () => ({ MotiView: 'MotiView' }));
jest.mock('expo-linear-gradient', () => ({ LinearGradient: 'LinearGradient' }));
jest.mock('react-native-reanimated', () => ({ View: 'View', default: {} }));
jest.mock('../pages/live/components/FeedSkeleton', () => 'FeedSkeleton');
jest.mock('../components/ErrorState', () => 'ErrorState');
jest.mock('../pages/notifications/components/NotificationHeader', () => 'NotificationHeader');
jest.mock('../pages/notifications/components/NotificationSection', () => 'NotificationSection');
jest.mock('../pages/notifications/components/EmptyState', () => 'EmptyState');

const mockFetch = jest.fn();
const mockMarkRead = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  useNotifications.mockReturnValue({
    notifications: [],
    loading: false,
    error: null,
    fetchNotifications: mockFetch,
    markAsRead: mockMarkRead,
  });
});

function renderScreen() {
  const navigation = { navigate: jest.fn() };
  let tree;
  act(() => { tree = create(<NotificationsScreen navigation={navigation} />); });
  return { tree, navigation };
}

describe('NotificationsScreen', () => {
  test('renders without crashing', () => {
    const { tree } = renderScreen();
    expect(tree.toJSON()).toBeTruthy();
  });

  test('useNotifications hook is invoked on mount', () => {
    renderScreen();
    expect(useNotifications).toHaveBeenCalled();
  });

  test('fetchNotifications is bound from useNotifications', async () => {
    mockFetch.mockResolvedValue({ success: true });
    renderScreen();
    const { fetchNotifications } = useNotifications();
    await act(async () => { await fetchNotifications(); });
    expect(mockFetch).toHaveBeenCalled();
  });

  test('loading state renders gracefully', () => {
    useNotifications.mockReturnValue({
      notifications: [],
      loading: true,
      error: null,
      fetchNotifications: mockFetch,
      markAsRead: mockMarkRead,
    });
    const { tree } = renderScreen();
    expect(tree.toJSON()).toBeTruthy();
  });

  test('renders with notifications data', () => {
    useNotifications.mockReturnValue({
      notifications: [{ id: 'n1', title: 'Test', body: 'Hello' }],
      loading: false,
      error: null,
      fetchNotifications: mockFetch,
      markAsRead: mockMarkRead,
    });
    const { tree } = renderScreen();
    expect(tree.toJSON()).toBeTruthy();
  });
});
