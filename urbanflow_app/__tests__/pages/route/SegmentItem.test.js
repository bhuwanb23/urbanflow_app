import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SegmentItem from '../../../pages/route/components/SegmentItem';

// Mock dependencies
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('../../../pages/route/components/SegmentIcon', () => {
  const { View } = require('react-native');
  return ({ type }) => View ? require('react').createElement(View, { testID: 'segment-icon', 'data-type': type }) : null;
});
jest.mock('../../../pages/route/components/SegmentConnector', () => {
  const { View } = require('react-native');
  return () => require('react').createElement(View, { testID: 'segment-connector' });
});
jest.mock('../../../pages/route/hooks/useAccessibility', () => ({
  useAccessibility: () => ({
    triggerHapticFeedback: jest.fn(),
    announceForAccessibility: jest.fn(),
  }),
}));

describe('SegmentItem', () => {
  const mockSegment = {
    id: 'seg-1',
    type: 'walk',
    title: 'Walk to Central St.',
    duration: 480, // seconds -> 8 min
    distance: 640, // meters -> 0.6 km
    status: 'on-time',
    features: ['On Time'],
  };

  it('renders segment information correctly', () => {
    const { getByText } = render(
      <SegmentItem segment={mockSegment} />
    );

    expect(getByText('Walk to Central St.')).toBeTruthy();
    expect(getByText('0.6 km')).toBeTruthy();
    expect(getByText('8 min')).toBeTruthy();
  });

  it('displays status badge', () => {
    const { getByText } = render(
      <SegmentItem segment={mockSegment} />
    );

    expect(getByText('On Time')).toBeTruthy();
  });

  it('shows delay information when delayed', () => {
    const delayedSegment = {
      ...mockSegment,
      status: 'delayed',
      delayInfo: '5m delay',
    };

    const { getByText } = render(
      <SegmentItem segment={delayedSegment} />
    );

    expect(getByText('5m delay')).toBeTruthy();
  });

  it('displays live tracking indicator', () => {
    const liveSegment = {
      ...mockSegment,
      type: 'bus',
      liveTracking: true,
    };

    const { getByText } = render(
      <SegmentItem segment={liveSegment} />
    );

    expect(getByText('LIVE TRACKING ACTIVE')).toBeTruthy();
  });

  it('shows occupancy information', () => {
    const busySegment = {
      ...mockSegment,
      type: 'metro',
      occupancy: 'high',
    };

    const { getByText } = render(
      <SegmentItem segment={busySegment} />
    );

    expect(getByText('High occupancy')).toBeTruthy();
  });

  it('displays nearby station indicator for bike segments', () => {
    const bikeSegment = {
      ...mockSegment,
      type: 'bike',
      nearbyStation: true,
    };

    const { getByText } = render(
      <SegmentItem segment={bikeSegment} />
    );

    expect(getByText('STATION NEARBY')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const mockOnPress = jest.fn();

    const { getByLabelText } = render(
      <SegmentItem segment={mockSegment} onPress={mockOnPress} />
    );

    fireEvent.press(getByLabelText('walk segment: Walk to Central St.'));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility labels', () => {
    const { getByLabelText } = render(
      <SegmentItem segment={mockSegment} />
    );

    expect(getByLabelText('walk segment: Walk to Central St.')).toBeTruthy();
  });

  it('hides the connector when isLast is true', () => {
    const { queryByTestId } = render(
      <SegmentItem segment={mockSegment} isLast={true} />
    );

    expect(queryByTestId('segment-connector')).toBeNull();
  });

  it('renders the connector when not last', () => {
    const { queryByTestId } = render(
      <SegmentItem segment={mockSegment} isLast={false} />
    );

    expect(queryByTestId('segment-connector')).toBeTruthy();
  });
});
