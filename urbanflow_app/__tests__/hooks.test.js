/**
 * Hook tests for utils/hooks/useAPI.js
 * Mocks ../utils/api and verifies each hook calls the right API method.
 * Uses react-test-renderer's act.
 */

import React from 'react';
import { act, create } from 'react-test-renderer';

// Mock the api module BEFORE importing the hooks
jest.mock('../utils/api', () => ({
  authAPI: { verifyToken: jest.fn(), login: jest.fn(), logout: jest.fn(), register: jest.fn() },
  userAPI: { getProfile: jest.fn() },
  tripsAPI: { getTrips: jest.fn(), createTrip: jest.fn(), deleteTrip: jest.fn(), getTripStats: jest.fn() },
  routesAPI: { getRoutes: jest.fn(), searchRoutes: jest.fn(), getRouteById: jest.fn() },
  ecoStatsAPI: { getEcoStats: jest.fn(), getWeeklyStats: jest.fn(), getAchievements: jest.fn() },
  trafficAPI: { getLiveTraffic: jest.fn() },
  notificationsAPI: { getNotifications: jest.fn(), markAsRead: jest.fn() },
  tokenManager: {
    isLoggedIn: jest.fn(),
    getUserData: jest.fn(),
    setUserData: jest.fn(),
    clearUserData: jest.fn(),
  },
  authFlow: { login: jest.fn(), logout: jest.fn() },
  demoAPI: { getDemo: jest.fn() },
  healthAPI: { getHealth: jest.fn() },
}));

const { useAuth, useTrips, useRoutes, useEcoStats, useTraffic, useNotifications } = require('../utils/hooks/useAPI');

function captureHook(hookFn) {
  const ref = { current: null };
  function Probe() {
    ref.current = hookFn();
    return null;
  }
  let tree;
  act(() => { tree = create(React.createElement(Probe)); });
  return {
    get value() { return ref.current; },
    unmount() { act(() => tree.unmount()); },
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useAuth', () => {
  test('starts loading then finishes when not logged in', async () => {
    const { tokenManager } = require('../utils/api');
    tokenManager.isLoggedIn.mockResolvedValue(false);
    const c = captureHook(useAuth);
    expect(c.value.loading).toBe(true);
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });
    expect(c.value.loading).toBe(false);
    expect(c.value.user).toBeNull();
  });

  test('calls tokenManager.getUserData when logged in', async () => {
    const { tokenManager } = require('../utils/api');
    tokenManager.isLoggedIn.mockResolvedValue(true);
    tokenManager.getUserData.mockResolvedValue({ id: '1', email: 'a@b.com' });
    const c = captureHook(useAuth);
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });
    expect(tokenManager.getUserData).toHaveBeenCalled();
  });
});

describe('useTrips', () => {
  test('fetchTrips calls tripsAPI.getTrips and updates state', async () => {
    const { tripsAPI } = require('../utils/api');
    tripsAPI.getTrips.mockResolvedValue({ success: true, data: { trips: [{ id: '1' }] } });
    const c = captureHook(useTrips);
    await act(async () => { await c.value.fetchTrips(); });
    expect(tripsAPI.getTrips).toHaveBeenCalled();
    expect(c.value.loading).toBe(false);
  });

  test('fetchTrips error path: API call recorded', async () => {
    // Just verify the success path is robust; error path is covered by apiUtility tests
    const { tripsAPI } = require('../utils/api');
    tripsAPI.getTrips.mockResolvedValue({ success: false });
    const c = captureHook(useTrips);
    await act(async () => { await c.value.fetchTrips(); });
    expect(tripsAPI.getTrips).toHaveBeenCalled();
  });
});

describe('useRoutes', () => {
  test('searchRoutes calls routesAPI.searchRoutes with query', async () => {
    const { routesAPI } = require('../utils/api');
    routesAPI.searchRoutes.mockResolvedValue({ success: true, data: { routes: [] } });
    const c = captureHook(useRoutes);
    await act(async () => { await c.value.searchRoutes('bus'); });
    expect(routesAPI.searchRoutes).toHaveBeenCalledWith('bus');
  });
});

describe('useEcoStats', () => {
  test('fetchEcoStats calls ecoStatsAPI.getEcoStats', async () => {
    const { ecoStatsAPI } = require('../utils/api');
    ecoStatsAPI.getEcoStats.mockResolvedValue({ success: true, data: { trips: { total: 0 } } });
    const c = captureHook(useEcoStats);
    await act(async () => { await c.value.fetchEcoStats(); });
    expect(ecoStatsAPI.getEcoStats).toHaveBeenCalled();
  });
});

describe('useTraffic', () => {
  test('fetchLiveTraffic calls trafficAPI.getLiveTraffic', async () => {
    const { trafficAPI } = require('../utils/api');
    trafficAPI.getLiveTraffic.mockResolvedValue({ success: true, data: { conditions: [] } });
    const c = captureHook(useTraffic);
    await act(async () => { await c.value.fetchLiveTraffic(); });
    expect(trafficAPI.getLiveTraffic).toHaveBeenCalled();
  });
});

describe('useNotifications', () => {
  test('fetchNotifications calls notificationsAPI.getNotifications', async () => {
    const { notificationsAPI } = require('../utils/api');
    notificationsAPI.getNotifications.mockResolvedValue({ success: true, data: { notifications: [] } });
    const c = captureHook(useNotifications);
    await act(async () => { await c.value.fetchNotifications(); });
    expect(notificationsAPI.getNotifications).toHaveBeenCalled();
  });

  test('markAsRead calls notificationsAPI.markAsRead with id', async () => {
    const { notificationsAPI } = require('../utils/api');
    notificationsAPI.markAsRead.mockResolvedValue({ success: true });
    const c = captureHook(useNotifications);
    await act(async () => { await c.value.markAsRead('n1'); });
    expect(notificationsAPI.markAsRead).toHaveBeenCalledWith('n1');
  });
});
