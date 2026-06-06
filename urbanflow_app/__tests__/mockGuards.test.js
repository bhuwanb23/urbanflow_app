/**
 * 4.8 — Mock fallback guards tests
 * Verifies that demoAPI short-circuits in production
 * (when __DEV__ is false) so the production build never
 * returns fabricated data. Also confirms the methods are
 * reachable in dev.
 */

const ORIGINAL_DEV = global.__DEV__;

function setDevFlag(value) {
  Object.defineProperty(global, '__DEV__', { value, configurable: true, writable: true });
}

afterAll(() => {
  setDevFlag(ORIGINAL_DEV);
});

describe('4.8 — demoAPI in production', () => {
  beforeEach(() => {
    setDevFlag(false);
  });

  test('demoAPI.getTrafficData throws in production', async () => {
    const { demoAPI } = require('../utils/api');
    await expect(demoAPI.getTrafficData()).rejects.toThrow(/dev-only/);
  });

  test('demoAPI.getRouteSuggestions throws in production', async () => {
    const { demoAPI } = require('../utils/api');
    await expect(demoAPI.getRouteSuggestions()).rejects.toThrow(/dev-only/);
  });
});

describe('4.8 — demoAPI in development', () => {
  beforeEach(() => {
    setDevFlag(true);
  });

  test('demoAPI methods are exposed in dev (do not throw the dev-only guard)', async () => {
    const { demoAPI } = require('../utils/api');
    expect(typeof demoAPI.getTrafficData).toBe('function');
    expect(typeof demoAPI.getRouteSuggestions).toBe('function');
    const fetchSpy = jest.spyOn(global, 'fetch').mockRejectedValue(new Error('no network in test'));
    await expect(demoAPI.getRouteSuggestions()).rejects.toThrow(/no network in test/);
    fetchSpy.mockRestore();
  });
});
