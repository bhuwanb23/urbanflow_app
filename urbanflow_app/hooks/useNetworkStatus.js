/**
 * useNetworkStatus Hook
 * Subscribes to NetInfo and returns the current connectivity
 * status. Defaults to `isConnected: true` until the first
 * event fires so screens don't briefly render an offline
 * banner during cold start.
 */

import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [status, setStatus] = useState({
    isConnected: true,
    isInternetReachable: true,
    type: null,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setStatus({
        isConnected: state.isConnected !== false,
        isInternetReachable: state.isInternetReachable !== false,
        type: state.type,
      });
    });
    return unsubscribe;
  }, []);

  const isOffline = !status.isConnected || status.isInternetReachable === false;
  return { ...status, isOffline };
}

export default useNetworkStatus;
