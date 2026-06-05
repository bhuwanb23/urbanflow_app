/**
 * 3.3 — RouteContext routeId fetch tests
 * Verifies the provider fetches via routesAPI.getRoute(routeId),
 * surfaces loading/error/empty states, and respects an
 * initialRoute override for offline flows.
 */

import React from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';

jest.mock('../utils/api', () => {
  const actual = jest.requireActual('../utils/api');
  return {
    ...actual,
    routesAPI: {
      getRoute: jest.fn(),
    },
  };
});

const { routesAPI } = require('../utils/api');
const { RouteProvider, useRoute } = require('../pages/route/context/RouteContext');

function Probe({ children }) {
  const ctx = useRoute();
  return (
    <>
      <Text testID="loading">{String(ctx.isLoading)}</Text>
      <Text testID="error">{ctx.error || ''}</Text>
      <Text testID="routeId">{ctx.currentRoute ? ctx.currentRoute.id : ''}</Text>
      {children}
    </>
  );
}

describe('3.3 — RouteProvider routeId fetch', () => {
  beforeEach(() => {
    routesAPI.getRoute.mockReset();
  });

  test('does not fetch when no routeId or initialRoute is provided', async () => {
    render(
      <RouteProvider>
        <Probe />
      </RouteProvider>
    );
    await new Promise((r) => setImmediate(r));
    expect(routesAPI.getRoute).not.toHaveBeenCalled();
  });

  test('uses initialRoute as the authoritative source and skips the fetch', async () => {
    const initialRoute = {
      id: 'initial-1',
      from: 'A',
      to: 'B',
      segments: [{ id: 's1', type: 'walk', title: 'Walk', duration: '5 min' }],
    };
    render(
      <RouteProvider routeId="ignored" initialRoute={initialRoute}>
        <Probe />
      </RouteProvider>
    );
    await new Promise((r) => setImmediate(r));
    expect(routesAPI.getRoute).not.toHaveBeenCalled();
  });

  test('fetches via routesAPI.getRoute(routeId) and hydrates currentRoute', async () => {
    routesAPI.getRoute.mockResolvedValue({
      data: {
        route: {
          id: 'r-42',
          from: 'X',
          to: 'Y',
          segments: [{ id: 's1', type: 'bus', title: 'Bus', duration: '20 min' }],
        },
      },
    });
    const { getByTestId } = render(
      <RouteProvider routeId="r-42">
        <Probe />
      </RouteProvider>
    );
    expect(getByTestId('loading').props.children).toBe('true');
    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
    expect(getByTestId('routeId').props.children).toBe('r-42');
    expect(getByTestId('error').props.children).toBe('');
  });

  test('exposes an error string when the fetch fails', async () => {
    routesAPI.getRoute.mockRejectedValue(new Error('network down'));
    const { getByTestId } = render(
      <RouteProvider routeId="r-fail">
        <Probe />
      </RouteProvider>
    );
    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
    expect(getByTestId('error').props.children).toBe('network down');
    expect(getByTestId('routeId').props.children).toBe('');
  });

  test('treats an empty response payload as "Route not found"', async () => {
    routesAPI.getRoute.mockResolvedValue({ data: null });
    const { getByTestId } = render(
      <RouteProvider routeId="r-missing">
        <Probe />
      </RouteProvider>
    );
    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
    expect(getByTestId('error').props.children).toBe('Route not found');
  });
});
