/**
 * Carbon calculator unit tests
 * Verifies emission factors, eco scores, and savings math
 */

const cc = require('../../utils/carbonCalculator');

test('module exports expected functions', () => {
  expect(typeof cc.calculateLegEmissions).toBe('function');
  expect(typeof cc.calculateTotalEmissions).toBe('function');
  expect(typeof cc.calculateCarbonSaved).toBe('function');
  expect(typeof cc.getEcoScore).toBe('function');
  expect(typeof cc.getEmissionFactor).toBe('function');
  expect(typeof cc.compareModes).toBe('function');
});

test('emission factors cover all expected modes', () => {
  expect(cc.EMISSION_FACTORS.bus).toBeGreaterThan(0);
  expect(cc.EMISSION_FACTORS.metro).toBeGreaterThan(0);
  expect(cc.EMISSION_FACTORS.walk).toBe(0);
  expect(cc.EMISSION_FACTORS.bicycle).toBe(0);
  expect(cc.EMISSION_FACTORS.car).toBeGreaterThan(cc.EMISSION_FACTORS.bus);
});

test('calculateLegEmissions multiplies distance by factor', () => {
  const bus10km = cc.calculateLegEmissions(10, 'bus');
  expect(bus10km).toBeCloseTo(0.89, 2);

  const car10km = cc.calculateLegEmissions(10, 'car');
  expect(car10km).toBeCloseTo(1.92, 2);

  const walk10km = cc.calculateLegEmissions(10, 'walk');
  expect(walk10km).toBe(0);
});

test('calculateLegEmissions defaults to car factor for unknown mode', () => {
  const unknown = cc.calculateLegEmissions(10, 'flying-car');
  expect(unknown).toBeCloseTo(1.92, 2);  // same as car
});

test('calculateTotalEmissions sums legs (meters → km)', () => {
  const legs = [
    { mode: 'bus', distance: 5000 },     // 5km bus
    { mode: 'walk', distance: 1000 }     // 1km walk
  ];
  // 5 * 0.089 + 1 * 0 = 0.445
  expect(cc.calculateTotalEmissions(legs)).toBeCloseTo(0.445, 3);
});

test('calculateCarbonSaved returns car emissions - trip emissions', () => {
  const legs = [{ mode: 'bus', distance: 5000 }];  // 5km bus
  // Car would emit 5 * 0.192 = 0.96kg
  // Bus emits 5 * 0.089 = 0.445kg
  // Savings = 0.96 - 0.445 = 0.515
  const saved = cc.calculateCarbonSaved(legs);
  expect(saved).toBeCloseTo(0.515, 3);
  expect(saved).toBeGreaterThan(0);
});

test('calculateCarbonSaved is zero for walk-only trip', () => {
  const legs = [{ mode: 'walk', distance: 1000 }];
  // Car would emit 1 * 0.192 = 0.192, walk emits 0, savings = 0.192
  const saved = cc.calculateCarbonSaved(legs);
  expect(saved).toBeCloseTo(0.192, 3);
});

test('getEcoScore grades walking 100% as A+', () => {
  // walking 5km saves exactly 5 * 0.192 = 0.96kg → 100% eco score
  const score = cc.getEcoScore(0.96, 5);
  expect(score.grade).toBe('A+');
  expect(score.percentage).toBe(100);
});

test('getEcoScore grades car trip as low', () => {
  // 0kg saved, 5km trip
  const score = cc.getEcoScore(0, 5);
  expect(score.grade).toBe('E');
  expect(score.percentage).toBe(0);
});

test('getEcoScore returns N/A for zero distance', () => {
  const score = cc.getEcoScore(0, 0);
  expect(score.grade).toBe('N/A');
  expect(score.percentage).toBe(0);
});

test('compareModes returns one entry per mode', () => {
  const result = cc.compareModes(10, ['bus', 'metro', 'car', 'walk']);
  expect(result.length).toBe(4);
  expect(result[0].mode).toBe('bus');
  expect(result[3].savings).toBeGreaterThan(result[2].savings);  // walk > car savings
});

test('getEmissionFactor returns correct factor for mode', () => {
  expect(cc.getEmissionFactor('bus')).toBe(0.089);
  expect(cc.getEmissionFactor('metro')).toBe(0.041);
});
