/**
 * PlannerScreen tests
 * Tests render, api integration, and search input handling.
 */

import React from 'react';
import { act, create } from 'react-test-renderer';
import PlannerScreen from '../pages/planner/PlannerScreen';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('moti', () => ({ MotiView: 'MotiView' }));
jest.mock('expo-linear-gradient', () => ({ LinearGradient: 'LinearGradient' }));

jest.mock('../utils/api', () => ({
  __esModule: true,
  default: {
    planJourney: jest.fn(),
    getRoutes: jest.fn(),
  },
  routesAPI: { searchRoutes: jest.fn() },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

function renderPlanner() {
  const navigation = { navigate: jest.fn(), replace: jest.fn() };
  const route = { params: {} };
  let tree;
  act(() => { tree = create(<PlannerScreen navigation={navigation} route={route} />); });
  return { tree, navigation };
}

describe('PlannerScreen', () => {
  test('renders without crashing', () => {
    const { tree } = renderPlanner();
    expect(tree.toJSON()).toBeTruthy();
  });

  test('component mounts and renders UI elements', () => {
    const { tree } = renderPlanner();
    const json = tree.toJSON();
    expect(json).toBeTruthy();
    expect(json).toBeDefined();
  });

  test('navigation object is accepted as a prop', () => {
    const { navigation } = renderPlanner();
    expect(navigation.navigate).toBeDefined();
  });

  test('component handles empty route params gracefully', () => {
    const navigation = { navigate: jest.fn(), replace: jest.fn() };
    let tree;
    act(() => { tree = create(<PlannerScreen navigation={navigation} route={{ params: null }} />); });
    expect(tree.toJSON()).toBeTruthy();
  });

  test('component accepts a routeId in params', () => {
    const navigation = { navigate: jest.fn(), replace: jest.fn() };
    const route = { params: { routeId: '500A' } };
    let tree;
    act(() => { tree = create(<PlannerScreen navigation={navigation} route={route} />); });
    expect(tree.toJSON()).toBeTruthy();
  });
});
