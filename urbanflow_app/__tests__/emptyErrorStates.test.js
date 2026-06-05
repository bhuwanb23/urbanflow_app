/**
 * 3.5 — EmptyState / ErrorState tests
 * Validates the shared empty/error components used across
 * Planner, Trips, EcoStats, Notifications, and Profile.
 */

import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

describe('3.5 — EmptyState', () => {
  test('renders title and message', () => {
    const { getByText } = render(
      <EmptyState title="Nothing here" message="Try again later" />
    );
    expect(getByText('Nothing here')).toBeTruthy();
    expect(getByText('Try again later')).toBeTruthy();
  });

  test('invokes onRefresh when the button is pressed', () => {
    const onRefresh = jest.fn();
    const { getByText } = render(
      <EmptyState
        title="Empty"
        message="No items"
        onRefresh={onRefresh}
        refreshLabel="Reload"
      />
    );
    fireEvent.press(getByText('Reload'));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  test('does not render a refresh button when onRefresh is missing', () => {
    const { queryByText } = render(<EmptyState title="Empty" message="x" />);
    expect(queryByText('Refresh')).toBeNull();
  });
});

describe('3.5 — ErrorState', () => {
  test('renders the default title and message', () => {
    const { getByText } = render(<ErrorState message="Network down" />);
    expect(getByText('Couldn’t load this')).toBeTruthy();
    expect(getByText('Network down')).toBeTruthy();
  });

  test('invokes onRetry when the Try again button is pressed', () => {
    const onRetry = jest.fn();
    const { getByText } = render(<ErrorState message="Boom" onRetry={onRetry} />);
    fireEvent.press(getByText('Try again'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  test('compact variant renders an inline error row', () => {
    const onRetry = jest.fn();
    const { getByText } = render(
      <ErrorState compact message="Inline failure" onRetry={onRetry} />
    );
    expect(getByText('Inline failure')).toBeTruthy();
    fireEvent.press(getByText('Try again'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
