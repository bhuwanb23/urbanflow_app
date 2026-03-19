import React from 'react';
import { render } from '@testing-library/react-native';
import SegmentItem from '../pages/route/components/SegmentItem';

// Mock dependencies
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('../pages/route/components/SegmentIcon', () => {
  return function MockSegmentIcon({ type }) {
    return <MockIcon data-testid="segment-icon" data-type={type} />;
  };
});
jest.mock('../pages/route/components/SegmentConnector', () => {
  return function MockSegmentConnector() {
    return null;
  };
});
jest.mock('../pages/route/hooks/useAccessibility', () => ({
  useAccessibility: () => ({
    triggerHapticFeedback: jest.fn(),
  })
}));

const MockIcon = require('react').createContext(null);

describe('SegmentItem', () => {
  const mockSegment = {
    id: 'seg-1',
    type: 'walk',
    title: 'Walk to Central St.',
    duration: '8 mins',
    distance: '0.4 miles',
    status: 'on-time',
    features: ['On Time'],
  };

  it('renders segment information correctly', () => {
    const { getByText } = render(
      <SegmentItem segment={mockSegment} />
    );
    
    expect(getByText('Walk to Central St.')).toBeTruthy();
    expect(getByText('0.4 miles')).toBeTruthy();
    expect(getByText('8 mins')).toBeTruthy();
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
    
    const { getByText } = render(
      <SegmentItem segment={mockSegment} onPress={mockOnPress} />
    );
    
    const card = getByText('Walk to Central St.').parent;
    card.props.onPress();
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility labels', () => {
    const { getByLabelText } = render(
      <SegmentItem segment={mockSegment} />
    );
    
    expect(getByLabelText('walk segment: Walk to Central St.')).toBeTruthy();
  });

  it('applies isLast prop correctly', () => {
    // When isLast is true, connector should not be shown
    const { queryByTestId } = render(
      <SegmentItem segment={mockSegment} isLast={true} />
    );
    
    // Connector should not be rendered
    expect(queryByTestId('segment-connector')).toBeNull();
  });
});
