/**
 * DataLoader unit tests
 * Tests pure-logic methods that don't require file I/O.
 */

const DataLoader = require('../../utils/DataLoader');

let loader;

beforeEach(() => {
  loader = new DataLoader();
});

test('constructor initializes empty caches', () => {
  expect(loader.scheduleCache.size).toBe(0);
  expect(loader.shapeCache.size).toBe(0);
  expect(loader.stops).toBeNull();
  expect(loader.routes).toBeNull();
});

test('getSummary returns null before loadAll', () => {
  expect(loader.getSummary()).toBeNull();
});

test('getStops returns null when not loaded', () => {
  expect(loader.getStops()).toBeNull();
});

test('getRoutes returns null when not loaded', () => {
  expect(loader.getRoutes()).toBeNull();
});

test('getRouteById returns undefined for missing route', () => {
  loader.routes = [];
  expect(loader.getRouteById('nope')).toBeUndefined();
});

test('getRouteById returns the matching route', () => {
  loader.routes = [
    { id: '1', shortName: '1A' },
    { id: '2', shortName: '2B' }
  ];
  expect(loader.getRouteById('1').shortName).toBe('1A');
});

test('getSearchIndex returns null when not loaded', () => {
  expect(loader.getSearchIndex()).toBeNull();
});

test('getTransfers returns null when not loaded', () => {
  expect(loader.getTransfers()).toBeNull();
});

test('findNearby requires loaded stops (throws if not loaded)', () => {
  // findNearby calls this.stops.filter — if stops is null, throws
  expect(() => loader.findNearby(12.9, 77.6, 500)).toThrow();
});

test('findNearby filters stops by bounding box distance', () => {
  loader.stops = [
    { stopId: 'near', name: 'Near', lat: 12.9, lon: 77.6 },
    { stopId: 'far', name: 'Far', lat: 13.5, lon: 78.0 }
  ];
  const nearby = loader.findNearby(12.9, 77.6, 1000);
  expect(nearby.length).toBeGreaterThan(0);
  expect(nearby.some(s => s.stopId === 'near')).toBe(true);
});
