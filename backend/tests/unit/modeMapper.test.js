/**
 * Mode mapper unit tests
 * Verifies all modes return valid icons and consistent shapes
 */

const mm = require('../../utils/modeMapper');

test('exports all expected functions', () => {
  expect(typeof mm.getModeInfo).toBe('function');
  expect(typeof mm.getModeIcon).toBe('function');
  expect(typeof mm.isEcoFriendly).toBe('function');
  expect(typeof mm.getAllModes).toBe('function');
  expect(typeof mm.getModesByCategory).toBe('function');
});

test('getModeInfo returns valid shape for known mode', () => {
  const info = mm.getModeInfo('BUS');
  expect(info.icon).toBe('bus');
  expect(info.color).toMatch(/^#[0-9a-f]{6}$/i);
  expect(info.bgColor).toBeDefined();
  expect(info.label).toBe('Bus');
  expect(info.category).toBe('transit');
});

test('getModeInfo is case-insensitive', () => {
  expect(mm.getModeInfo('bus').icon).toBe('bus');
  expect(mm.getModeInfo('Bus').icon).toBe('bus');
  expect(mm.getModeInfo('BUS').icon).toBe('bus');
});

test('getModeInfo returns fallback for unknown mode', () => {
  const info = mm.getModeInfo('UNKNOWN');
  expect(info.icon).toBe('help-circle');
  expect(info.category).toBe('other');
  expect(info.label).toBe('UNKNOWN');
});

test('all known modes have non-empty icon and color', () => {
  const allModes = mm.getAllModes();
  expect(allModes.length).toBeGreaterThan(5);
  for (const mode of allModes) {
    const info = mm.getModeInfo(mode);
    expect(info.icon).toBeTruthy();
    expect(info.color).toMatch(/^#[0-9a-f]{6}$/i);
  }
});

test('isEcoFriendly returns true for transit and active modes', () => {
  expect(mm.isEcoFriendly('BUS')).toBe(true);
  expect(mm.isEcoFriendly('SUBWAY')).toBe(true);
  expect(mm.isEcoFriendly('WALK')).toBe(true);
  expect(mm.isEcoFriendly('BICYCLE')).toBe(true);
});

test('isEcoFriendly returns false for private/commercial', () => {
  expect(mm.isEcoFriendly('CAR')).toBe(false);
  expect(mm.isEcoFriendly('TAXI')).toBe(false);
  expect(mm.isEcoFriendly('AUTO_RICKSHAW')).toBe(false);
});

test('getModesByCategory returns modes in the category', () => {
  const transit = mm.getModesByCategory('transit');
  expect(transit).toContain('BUS');
  expect(transit).toContain('SUBWAY');

  const active = mm.getModesByCategory('active');
  expect(active).toContain('WALK');
  expect(active).toContain('BICYCLE');

  const privModes = mm.getModesByCategory('private');
  expect(privModes).toContain('CAR');
  expect(privModes).not.toContain('BUS');
});

test('getModeIcon, getModeColor, getModeLabel return single fields', () => {
  expect(mm.getModeIcon('BUS')).toBe('bus');
  expect(mm.getModeColor('BUS')).toMatch(/^#[0-9a-f]{6}$/i);
  expect(mm.getModeLabel('BUS')).toBe('Bus');
  expect(mm.getModeCategory('BUS')).toBe('transit');
});

test('mapMultipleModes returns array of mode info objects', () => {
  const result = mm.mapMultipleModes(['BUS', 'WALK', 'CAR']);
  expect(result.length).toBe(3);
  expect(result[0].otpMode).toBe('BUS');
  expect(result[0].icon).toBe('bus');
});
