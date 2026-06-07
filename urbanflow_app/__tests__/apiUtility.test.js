/**
 * utils/api.js — focused tests covering auth, user, trips, ecoStats, traffic, notifications, journey APIs
 * Uses fetch mock to drive success + error paths.
 */

import {
  authAPI, userAPI, tripsAPI, ecoStatsAPI, trafficAPI, notificationsAPI, journeyAPI, healthAPI
} from '../utils/api';

const mockFetch = (response) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => response
  });
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('authAPI', () => {
  test('register posts to /auth/register', async () => {
    mockFetch({ success: true, data: { token: 't' } });
    const res = await authAPI.register({ email: 'a@b.com', password: 'P1!aaaa' });
    expect(res.success).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/auth/register'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  test('login posts credentials', async () => {
    mockFetch({ success: true, data: { token: 't' } });
    await authAPI.login({ email: 'a@b.com', password: 'P1!aaaa' });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/auth/login'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});

describe('userAPI', () => {
  test('getProfile hits /user/profile', async () => {
    mockFetch({ success: true, data: { email: 'a@b.com' } });
    const res = await userAPI.getProfile();
    expect(res.data.email).toBe('a@b.com');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/user/profile'), expect.any(Object));
  });
});

describe('tripsAPI', () => {
  test('getTrips hits /trips', async () => {
    mockFetch({ success: true, data: { trips: [] } });
    await tripsAPI.getTrips();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/trips'), expect.any(Object));
  });

  test('createTrip posts to /trips', async () => {
    mockFetch({ success: true, data: { id: '1' } });
    await tripsAPI.createTrip({ from: {}, to: {}, mode: 'bus' });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/trips'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});

describe('ecoStatsAPI', () => {
  test('getEcoStats hits /ecostats', async () => {
    mockFetch({ success: true, data: { trips: { total: 0 } } });
    await ecoStatsAPI.getEcoStats();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/ecostats'), expect.any(Object));
  });

  test('getWeeklyStats hits /ecostats/weekly', async () => {
    mockFetch({ success: true, data: {} });
    await ecoStatsAPI.getWeeklyStats();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/ecostats/weekly'), expect.any(Object));
  });

  test('getAchievements hits /ecostats/achievements', async () => {
    mockFetch({ success: true, data: { achievements: [] } });
    await ecoStatsAPI.getAchievements();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/ecostats/achievements'), expect.any(Object));
  });
});

describe('trafficAPI', () => {
  test('getLiveTraffic hits /traffic', async () => {
    mockFetch({ success: true, data: { conditions: [] } });
    await trafficAPI.getLiveTraffic();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/traffic'), expect.any(Object));
  });
});

describe('notificationsAPI', () => {
  test('getNotifications hits /notifications', async () => {
    mockFetch({ success: true, data: { notifications: [] } });
    await notificationsAPI.getNotifications();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/notifications'), expect.any(Object));
  });

  test('markAsRead puts to /notifications/:id/read', async () => {
    mockFetch({ success: true });
    await notificationsAPI.markAsRead('abc');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/notifications/abc/read'),
      expect.objectContaining({ method: 'PUT' })
    );
  });
});

describe('journeyAPI', () => {
  test('planJourney posts to /plan', async () => {
    mockFetch({ success: true, data: { itineraries: [] } });
    await journeyAPI.planJourney({ from: {}, to: {} });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/plan'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});

describe('healthAPI', () => {
  test('getHealth hits /health (no /api/v1 prefix)', async () => {
    mockFetch({ success: true, status: 'healthy' });
    await healthAPI.getHealth();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/health'));
  });
});

describe('apiCall error handling', () => {
  test('non-2xx response throws', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ success: false, message: 'Internal error' })
    });
    await expect(userAPI.getProfile()).rejects.toThrow(/internal error|API call failed/i);
  });

  test('401 on protected endpoint throws and clears token', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ success: false, message: 'Session expired' })
    });
    await expect(userAPI.getProfile()).rejects.toThrow(/session expired/i);
  });
});
