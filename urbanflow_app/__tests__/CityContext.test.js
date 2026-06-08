import React from 'react';
import { act, create } from 'react-test-renderer';

jest.mock('../utils/api', () => ({
  citiesAPI: {
    getCities: jest.fn(),
    switchCity: jest.fn(),
    getCity: jest.fn(),
    getCurrentCity: jest.fn(),
  },
}));

const { citiesAPI } = require('../utils/api');
const { CityProvider, useCity } = require('../contexts/CityContext');

function setup(initialFn) {
  const ref = { current: null };
  function Probe() {
    ref.current = useCity();
    return null;
  }
  let tree;
  act(() => {
    tree = create(React.createElement(CityProvider, null, React.createElement(Probe)));
  });
  return { ref, tree };
}

beforeEach(() => {
  jest.clearAllMocks();
});

test('provides default city state while loading', () => {
  citiesAPI.getCities.mockReturnValue(new Promise(() => {}));
  const { ref } = setup();
  expect(ref.current.loading).toBe(true);
  expect(ref.current.currentCity.displayName).toBe('Delhi NCR');
  expect(ref.current.availableCities).toEqual([]);
});

test('loads available cities on mount', async () => {
  const mockCities = [
    { id: 'delhi', name: 'Delhi NCR', hasData: true },
    { id: 'bangalore', name: 'Bengaluru', hasData: true },
    { id: 'chennai', name: 'Chennai', hasData: false },
  ];
  citiesAPI.getCities.mockResolvedValue({
    success: true,
    data: { cities: mockCities, currentCity: 'delhi' },
  });

  const { ref } = setup();
  await act(() => Promise.resolve());
  expect(ref.current.loading).toBe(false);
  expect(ref.current.availableCities).toHaveLength(3);
  expect(ref.current.currentCity.id).toBe('delhi');
});

test('switches city via context', async () => {
  const mockCities = [
    { id: 'delhi', name: 'Delhi NCR', hasData: true },
    { id: 'bangalore', name: 'Bengaluru', hasData: true },
  ];
  citiesAPI.getCities.mockResolvedValue({
    success: true,
    data: { cities: mockCities, currentCity: 'delhi' },
  });
  citiesAPI.switchCity.mockResolvedValue({
    success: true,
    data: { currentCity: { displayName: 'Bengaluru' } },
  });

  const { ref } = setup();
  await act(() => Promise.resolve());

  await act(async () => {
    await ref.current.switchCity('bangalore');
  });

  expect(citiesAPI.switchCity).toHaveBeenCalledWith('bangalore');
  expect(ref.current.currentCity.id).toBe('bangalore');
  expect(ref.current.currentCity.displayName).toBe('Bengaluru');
});

test('handles API error gracefully', async () => {
  citiesAPI.getCities.mockRejectedValue(new Error('Network error'));
  const { ref } = setup();
  await act(() => Promise.resolve());
  expect(ref.current.loading).toBe(false);
  expect(ref.current.availableCities).toEqual([]);
  expect(ref.current.currentCity.displayName).toBe('Delhi NCR');
});

test('useCity returns defaults when outside provider', () => {
  const { ref, tree } = setup();
  act(() => { tree.update(React.createElement('div')); });
  // Re-create outside provider
  function OuterProbe() {
    const ctx = useCity();
    ref.current = ctx;
    return null;
  }
  act(() => { tree.update(React.createElement(OuterProbe)); });
  expect(ref.current.currentCity.displayName).toBe('Delhi NCR');
  expect(ref.current.availableCities).toEqual([]);
  expect(typeof ref.current.switchCity).toBe('function');
});
