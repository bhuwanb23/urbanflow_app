import React from 'react';
import { render } from '@testing-library/react-native';
import LiveDashboard from '../pages/live/components/LiveDashboard';

// Mock dependencies
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('moti', () => ({
  MotiView: 'MotiView',
}));

// LiveDashboard uses react-i18next; without a real instance `t` returns the
// key. Provide a tiny mock that resolves the keys used by the dashboard so the
// rendered English labels can be asserted.
jest.mock('react-i18next', () => {
  const en = {
    'live.realtimeActivity': 'Real-Time Activity',
    'live.viewArchive': 'VIEW ARCHIVE',
  };
  return {
    useTranslation: () => ({
      t: (key) => en[key] || key,
      i18n: { language: 'en', changeLanguage: jest.fn(), on: jest.fn(), off: jest.fn() },
    }),
    initReactI18next: { type: '3rdParty', init: () => {} },
  };
});

// The AQI/Traffic widgets render their labels only after a successful
// network load; in the test environment they fall back to "--". Mock them
// so the dashboard's labels are present without depending on the network.
jest.mock('../pages/live/components/AQIWidget', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => React.createElement(Text, null, 'AIR QUALITY INDEX');
});
jest.mock('../pages/live/components/TrafficWidget', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => React.createElement(Text, null, 'TRAFFIC LOAD');
});

describe('LiveDashboard', () => {
  it('renders correctly', () => {
    const { getByText } = render(<LiveDashboard />);

    // Check if main sections are rendered
    expect(getByText('SYSTEM STATUS')).toBeTruthy();
    expect(getByText('Metropolitan Core')).toBeTruthy();
    expect(getByText('LIVE INSIGHTS')).toBeTruthy();
    expect(getByText('AIR QUALITY INDEX')).toBeTruthy();
    expect(getByText('TRAFFIC LOAD')).toBeTruthy();
    expect(getByText('ACTIVE ALERTS')).toBeTruthy();
    expect(getByText('TRANSIT CAP.')).toBeTruthy();
    expect(getByText('Real-Time Activity')).toBeTruthy();
  });
});
