/**
 * 3.2 — Live hooks shape tests
 * Verifies the live data hooks return the expected shape
 * and handle empty / error states without throwing.
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';

jest.mock('../utils/api', () => {
  const actual = jest.requireActual('../utils/api');
  return {
    ...actual,
    trafficAPI: {
      getTrafficConditions: jest.fn(),
    },
    routesAPI: {
      getPopularRoutes: jest.fn(),
    },
  };
});

const { trafficAPI, routesAPI } = require('../utils/api');
const { useTrafficConditions } = require('../hooks/useTrafficConditions');
const { usePopularRoutes } = require('../hooks/usePopularRoutes');

describe('3.2 — useTrafficConditions', () => {
  beforeEach(() => {
    trafficAPI.getTrafficConditions.mockReset();
  });

  test('starts in loading state', () => {
    trafficAPI.getTrafficConditions.mockResolvedValue({ data: [] });
    const { result } = renderHook(() => useTrafficConditions('bengaluru', { enabled: false }));
    expect(result.current.loading).toBe(true);
    expect(result.current.conditions).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  test('populates conditions on success', async () => {
    trafficAPI.getTrafficConditions.mockResolvedValue({
      data: [
        { id: 'a', level: 'HIGH', area: 'Highway', changePercent: 28, delayMinutes: 45 },
        { id: 'b', level: 'LIGHT', area: 'Suburbs', changePercent: -10, delayMinutes: 0 },
      ],
    });
    const { result } = renderHook(() =>
      useTrafficConditions('bengaluru', { refreshInterval: 0 })
    );
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.conditions).toHaveLength(2);
    expect(result.current.error).toBeNull();
    expect(result.current.hasData).toBe(true);
  });

  test('captures error on failure', async () => {
    trafficAPI.getTrafficConditions.mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() =>
      useTrafficConditions('bengaluru', { refreshInterval: 0 })
    );
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('boom');
    expect(result.current.hasData).toBe(false);
  });

  test('does not fetch when disabled', async () => {
    trafficAPI.getTrafficConditions.mockResolvedValue({ data: [] });
    renderHook(() => useTrafficConditions('bengaluru', { enabled: false }));
    // Allow any pending microtasks to flush
    await act(async () => {});
    expect(trafficAPI.getTrafficConditions).not.toHaveBeenCalled();
  });
});

describe('3.2 — usePopularRoutes', () => {
  beforeEach(() => {
    routesAPI.getPopularRoutes.mockReset();
  });

  test('starts in loading state', () => {
    routesAPI.getPopularRoutes.mockResolvedValue({ data: [] });
    const { result } = renderHook(() => usePopularRoutes({ enabled: false }));
    expect(result.current.loading).toBe(true);
    expect(result.current.routes).toEqual([]);
  });

  test('populates routes on success', async () => {
    routesAPI.getPopularRoutes.mockResolvedValue({
      data: [
        { id: 'r1', origin: 'Home', destination: 'Work', durationMinutes: 32, usualDurationMinutes: 25, trafficStatus: 'MODERATE' },
      ],
    });
    const { result } = renderHook(() => usePopularRoutes({ refreshInterval: 0 }));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.routes).toHaveLength(1);
    expect(result.current.hasData).toBe(true);
  });

  test('captures error on failure', async () => {
    routesAPI.getPopularRoutes.mockRejectedValue(new Error('net'));
    const { result } = renderHook(() => usePopularRoutes({ refreshInterval: 0 }));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('net');
    expect(result.current.hasData).toBe(false);
  });
});
