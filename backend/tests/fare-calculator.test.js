const fc = require('../utils/fareCalculator');

test('module loads and exports functions', () => {
  expect(typeof fc.calculateBusFare).toBe('function');
  expect(typeof fc.calculateMetroFare).toBe('function');
  expect(typeof fc.calculateTotalFare).toBe('function');
});

test('bus fare returns a number', () => {
  const leg = { mode: 'bus', distance: 5000, route: '1' };
  const fare = fc.calculateBusFare(leg, null, 'delhi');
  expect(typeof fare).toBe('number');
  expect(fare).toBeGreaterThan(0);
});

test('metro fare differs by city', () => {
  const chennaiFare = fc.calculateMetroFare(12000, 'chennai');
  const bengaluruFare = fc.calculateMetroFare(12000, 'bengaluru');
  expect(chennaiFare).toBeGreaterThan(bengaluruFare);
});

// ---------- 2.6 — Missing transport modes ----------

const cc = require('../utils/carbonCalculator');
const mm = require('../utils/modeMapper');

test('carbon calculator has new transport modes', () => {
  const newModes = ['electric_car', 'e_rickshaw', 'scooter', 'electric_scooter', 'shared_bicycle', 'cable_car'];
  for (const mode of newModes) {
    expect(cc.EMISSION_FACTORS).toHaveProperty(mode);
  }
});

test('electric car has lower factor than petrol car', () => {
  expect(cc.EMISSION_FACTORS.electric_car).toBeLessThan(cc.EMISSION_FACTORS.car);
});

test('e-rickshaw has lower factor than auto', () => {
  expect(cc.EMISSION_FACTORS.e_rickshaw).toBeLessThan(cc.EMISSION_FACTORS.auto);
});

test('electric scooter has lower factor than petrol scooter', () => {
  expect(cc.EMISSION_FACTORS.electric_scooter).toBeLessThan(cc.EMISSION_FACTORS.scooter);
});

test('shared bicycle has zero emissions', () => {
  expect(cc.EMISSION_FACTORS.shared_bicycle).toBe(0);
});

test('mode mapper has new modes', () => {
  const allModes = mm.getAllModes();
  expect(allModes).toContain('ELECTRIC_CAR');
  expect(allModes).toContain('E_RICKSHAW');
  expect(allModes).toContain('SCOOTER');
  expect(allModes).toContain('ELECTRIC_SCOOTER');
  expect(allModes).toContain('SHARED_BICYCLE');
  expect(allModes).toContain('CABLE_CAR');
});

test('new mode info has correct structure', () => {
  const info = mm.getModeInfo('ELECTRIC_CAR');
  expect(info).toHaveProperty('icon');
  expect(info).toHaveProperty('color');
  expect(info).toHaveProperty('bgColor');
  expect(info).toHaveProperty('label');
});

test('mode mapper returns 16 total modes', () => {
  const allModes = mm.getAllModes();
  expect(allModes).toHaveLength(16);
});
