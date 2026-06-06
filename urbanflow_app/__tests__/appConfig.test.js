/**
 * 4.5 — Expo config tests
 * Verifies app.json has the iOS bundle identifier, the deep
 * linking scheme, the unified Android package name, and the
 * plugin list expected by the runtime.
 */

const appConfig = require('../app.json').expo;

describe('4.5 — Expo app.json', () => {
  test('ios.bundleIdentifier is set', () => {
    expect(appConfig.ios.bundleIdentifier).toBe('com.urbanflow.app');
  });

  test('android.package is set and matches the iOS bundle', () => {
    expect(appConfig.android.package).toBe('com.urbanflow.app');
  });

  test('scheme is set for deep linking', () => {
    expect(appConfig.scheme).toBe('urbanflow');
    const filters = appConfig.android.intentFilters || [];
    const hasUrbanflowScheme = filters.some((f) =>
      (f.data || []).some((d) => d.scheme === 'urbanflow')
    );
    expect(hasUrbanflowScheme).toBe(true);
  });

  test('plugins include expo-font, expo-haptics, expo-location, and expo-notifications', () => {
    const pluginNames = (appConfig.plugins || []).map((p) => (Array.isArray(p) ? p[0] : p));
    expect(pluginNames).toEqual(
      expect.arrayContaining(['expo-font', 'expo-haptics', 'expo-location', 'expo-notifications'])
    );
  });

  test('expo-location plugin declares the runtime permission copy', () => {
    const loc = (appConfig.plugins || []).find((p) => Array.isArray(p) && p[0] === 'expo-location');
    expect(loc).toBeTruthy();
    expect(loc[1].locationAlwaysAndWhenInUsePermission).toMatch(/UrbanFlow/);
  });
});
