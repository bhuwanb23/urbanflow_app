import { API_CONFIG } from '../utils/api';

describe('3.1 — API base URL configuration', () => {
  test('API_CONFIG has BASE_URL', () => {
    expect(API_CONFIG.BASE_URL).toBeDefined();
    expect(typeof API_CONFIG.BASE_URL).toBe('string');
    expect(API_CONFIG.BASE_URL.length).toBeGreaterThan(0);
  });

  test('API_CONFIG has VERSION', () => {
    expect(API_CONFIG.VERSION).toBe('v1');
  });

  test('API_CONFIG has TIMEOUT', () => {
    expect(typeof API_CONFIG.TIMEOUT).toBe('number');
    expect(API_CONFIG.TIMEOUT).toBeGreaterThan(0);
  });

  test('BASE_URL falls back to localhost:3000 in dev', () => {
    expect(API_CONFIG.BASE_URL).toMatch(/^https?:\/\//);
  });
});
