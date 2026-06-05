/**
 * 3.4 — App-level ErrorBoundary tests
 * Verifies the boundary renders the fallback when a child
 * throws, calls the onError callback, and recovers on retry.
 */

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { render, fireEvent, act } from '@testing-library/react-native';
import ErrorBoundary from '../components/ErrorBoundary';

function Boom({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('boom from Boom');
  }
  return <Text testID="ok">OK</Text>;
}

describe('3.4 — ErrorBoundary', () => {
  let consoleErrorSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    consoleErrorSpy.mockClear();
  });

  test('renders children when no error is thrown', () => {
    const { getByTestId } = render(
      <ErrorBoundary>
        <Boom shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(getByTestId('ok')).toBeTruthy();
  });

  test('renders fallback UI when a child throws', () => {
    const { getByText, queryByTestId } = render(
      <ErrorBoundary>
        <Boom shouldThrow />
      </ErrorBoundary>
    );
    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('boom from Boom')).toBeTruthy();
    expect(queryByTestId('ok')).toBeNull();
  });

  test('calls onError with the thrown error and info', () => {
    const onError = jest.fn();
    render(
      <ErrorBoundary onError={onError}>
        <Boom shouldThrow />
      </ErrorBoundary>
    );
    expect(onError).toHaveBeenCalledTimes(1);
    const [err] = onError.mock.calls[0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('boom from Boom');
  });

  test('recovers when the Try Again button is pressed', () => {
    let shouldThrow = true;
    const onReset = jest.fn();
    const Toggling = () => <Boom shouldThrow={shouldThrow} />;

    const { getByText, getByTestId, queryByText } = render(
      <ErrorBoundary onReset={onReset}>
        <Toggling />
      </ErrorBoundary>
    );

    // First render: in error state
    expect(getByText('Something went wrong')).toBeTruthy();
    expect(onReset).not.toHaveBeenCalled();

    // Flip the prop and press Try Again
    shouldThrow = false;
    fireEvent.press(getByText('Try again'));

    // Boundary should reset and re-render children
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(getByTestId('ok')).toBeTruthy();
    expect(queryByText('Something went wrong')).toBeNull();
  });

  test('uses a custom fallback function when provided', () => {
    const fallback = jest.fn(() => (
      <View>
        <Text>Custom fallback</Text>
      </View>
    ));
    const { getByText, queryByText } = render(
      <ErrorBoundary fallback={fallback}>
        <Boom shouldThrow />
      </ErrorBoundary>
    );
    expect(fallback).toHaveBeenCalled();
    expect(getByText('Custom fallback')).toBeTruthy();
    expect(queryByText('Something went wrong')).toBeNull();
  });
});
