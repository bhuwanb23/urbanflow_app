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
