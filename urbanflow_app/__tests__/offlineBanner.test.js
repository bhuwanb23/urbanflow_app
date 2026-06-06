/**
 * 4.7 — Offline banner tests
 * Verifies the OfflineBanner component shows / hides based on
 * useNetworkStatus, and that the retry button is wired up.
 */

import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent, act } from '@testing-library/react-native';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

let connected = true;
let reachable = true;
const listeners = [];

jest.mock('@react-native-community/netinfo', () => {
  return {
    addEventListener: (cb) => {
      listeners.push(cb);
      return () => {
        const i = listeners.indexOf(cb);
        if (i >= 0) listeners.splice(i, 1);
      };
    },
    __trigger: (state) => {
      listeners.forEach((cb) =>
        cb({ isConnected: state.connected, isInternetReachable: state.reachable, type: 'wifi' })
      );
    },
  };
});

const NetInfo = require('@react-native-community/netinfo');

const Probe = () => {
  // eslint-disable-next-line global-require
  const { useNetworkStatus } = require('../hooks/useNetworkStatus');
  const { isOffline } = useNetworkStatus();
  return <Text testID="status">{isOffline ? 'offline' : 'online'}</Text>;
};

beforeEach(() => {
  connected = true;
  reachable = true;
  listeners.length = 0;
});

describe('4.7 — useNetworkStatus', () => {
  test('defaults to online', () => {
    const { getByTestId } = render(<Probe />);
    expect(getByTestId('status').props.children).toBe('online');
  });

  test('flips to offline when NetInfo reports disconnected', () => {
    const { getByTestId } = render(<Probe />);
    act(() => {
      NetInfo.__trigger({ connected: false, reachable: false });
    });
    expect(getByTestId('status').props.children).toBe('offline');
  });
});

describe('4.7 — OfflineBanner', () => {
  test('renders nothing when online', () => {
    const OfflineBanner = require('../components/OfflineBanner').default;
    const { queryByTestId } = render(<OfflineBanner />);
    expect(queryByTestId('offline-banner')).toBeNull();
  });

  test('renders the banner and exposes the retry button when offline', () => {
    const onRetry = jest.fn();
    const OfflineBanner = require('../components/OfflineBanner').default;
    // First render while online
    const { queryByTestId, rerender, getByText } = render(<OfflineBanner onRetry={onRetry} />);
    expect(queryByTestId('offline-banner')).toBeNull();
    // Then go offline
    act(() => {
      NetInfo.__trigger({ connected: false, reachable: false });
    });
    rerender(<OfflineBanner onRetry={onRetry} />);
    expect(queryByTestId('offline-banner')).toBeTruthy();
    fireEvent.press(getByText('Retry'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
