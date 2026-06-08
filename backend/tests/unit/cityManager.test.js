const path = require('path');

jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

let cityManager;

beforeEach(() => {
  jest.isolateModules(() => {
    // Reset env for each test
    delete process.env.ACTIVE_CITY;
    delete process.env.DATA_DIR;
    delete process.env.SCHEDULE_DIR;
    delete process.env.SHAPES_DIR;
    cityManager = require('../../utils/cityManager');
  });
});

test('registers default cities on construction', () => {
  const cities = cityManager.getAllCities();
  expect(cities).toHaveLength(3);
  const ids = cities.map(c => c.id);
  expect(ids).toContain('delhi');
  expect(ids).toContain('bangalore');
  expect(ids).toContain('chennai');
});

test('getCity returns city by id', () => {
  const delhi = cityManager.getCity('delhi');
  expect(delhi).not.toBeUndefined();
  expect(delhi.displayName).toBe('Delhi NCR');
  expect(delhi.gtfs.staticDir).toContain(path.join('data', 'delhi', 'output'));
});

test('getCity returns undefined for unknown city', () => {
  expect(cityManager.getCity('atlantis')).toBeUndefined();
});

test('getCurrentCity returns default when ACTIVE_CITY not set', () => {
  const current = cityManager.getCurrentCity();
  expect(current).not.toBeUndefined();
  expect(current.id).toBe('delhi');
});

test('getCurrentCity respects ACTIVE_CITY env', () => {
  process.env.ACTIVE_CITY = 'bangalore';
  jest.isolateModules(() => {
    const cm = require('../../utils/cityManager');
    expect(cm.getCurrentCity().id).toBe('bangalore');
  });
});

test('setActiveCity switches to valid city', async () => {
  const city = await cityManager.setActiveCity('bangalore');
  expect(city.displayName).toBe('Bengaluru');
  expect(cityManager.getCurrentCity().id).toBe('bangalore');
});

test('setActiveCity updates env vars', async () => {
  await cityManager.setActiveCity('chennai');
  expect(process.env.ACTIVE_CITY).toBe('chennai');
  expect(process.env.DATA_DIR).toContain('chennai');
  expect(process.env.SHAPES_DIR).toContain('chennai');
});

test('setActiveCity throws for unknown city', async () => {
  await expect(cityManager.setActiveCity('atlantis')).rejects.toThrow(
    "City 'atlantis' not registered"
  );
});

test('getActiveCities returns only active cities', () => {
  const active = cityManager.getActiveCities();
  expect(active).toHaveLength(3);
  expect(active.every(c => c.active)).toBe(true);
});

test('isCityAvailable returns true for registered city', () => {
  expect(cityManager.isCityAvailable('delhi')).toBe(true);
});

test('isCityAvailable returns false for unknown city', () => {
  expect(cityManager.isCityAvailable('atlantis')).toBe(false);
});

test('getGtfsPath returns path with subpath', () => {
  const p = cityManager.getGtfsPath('delhi', 'schedule');
  expect(p).toContain(path.join('delhi', 'output'));
  expect(p).toContain('schedule');
});

test('getGtfsPath throws for unknown city', () => {
  expect(() => cityManager.getGtfsPath('atlantis')).toThrow(
    "City 'atlantis' not found"
  );
});

test('getGtfsRtConfig returns config for valid city', () => {
  const config = cityManager.getGtfsRtConfig('delhi');
  expect(config).toHaveProperty('source');
  expect(config).toHaveProperty('apiUrl');
});

test('getGtfsRtConfig throws for unknown city', () => {
  expect(() => cityManager.getGtfsRtConfig('atlantis')).toThrow(
    "City 'atlantis' not found"
  );
});

test('getSummary returns overview of all cities', () => {
  const summary = cityManager.getSummary();
  expect(summary.totalCities).toBe(3);
  expect(summary.currentCity).toBeDefined();
  expect(summary.cities).toHaveLength(3);
  expect(summary.cities[0]).toHaveProperty('id');
  expect(summary.cities[0]).toHaveProperty('hasGtfsRt');
});

test('setDataLoader stores reference', () => {
  const mockLoader = { loadAll: jest.fn(), dataDir: null };
  cityManager.setDataLoader(mockLoader);
  expect(cityManager.dataLoader).toBe(mockLoader);
});

test('setActiveCity calls dataLoader.loadAll when set', async () => {
  const mockLoader = { loadAll: jest.fn(), dataDir: null, scheduleDir: null, shapesDir: null, scheduleCache: new Map(), shapeCache: new Map() };
  cityManager.setDataLoader(mockLoader);
  await cityManager.setActiveCity('delhi');
  expect(mockLoader.loadAll).toHaveBeenCalled();
});

test('validateCityData returns not-found for unknown city', async () => {
  const result = await cityManager.validateCityData('atlantis');
  expect(result.valid).toBe(false);
  expect(result.error).toContain('not found');
});

test('validateCityData returns valid for city with existing data dir', async () => {
  const fs = require('fs');
  const existingDir = path.join(__dirname, '../../../data/delhi/output');
  const result = await cityManager.validateCityData('delhi');
  // If the dir exists on disk, it's valid
  if (fs.existsSync(existingDir)) {
    expect(result.valid).toBe(true);
  } else {
    expect(result.valid).toBe(false);
  }
});
