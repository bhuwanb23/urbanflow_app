/**
 * Route Constants and Mock Data
 * Based on the route.html prototype design
 */

// Mock route data matching the HTML design
export const MOCK_ROUTE_DATA = {
  id: 'route-001',
  from: 'Central St.',
  to: 'Airport Terminal',
  duration: '42 min',
  arrivalTime: '09:15 AM',
  distance: '5.2 miles',
  ecoScore: 8.5,
  cost: '$4.50',
  hasMapPreview: true,
  mapPreviewIndex: 2, // After bus segment
  segments: [
    {
      id: 'seg-1',
      type: 'walk',
      title: 'Walk to Central St.',
      duration: '8 mins',
      distance: '0.4 miles',
      status: 'on-time',
      features: ['On Time'],
      accessibility: true,
    },
    {
      id: 'seg-2',
      type: 'bus',
      title: 'Bus 102',
      duration: '12 mins',
      stops: 6,
      status: 'delayed',
      delayInfo: '2m delay',
      laneInfo: 'LANE 4',
      liveTracking: true,
      features: ['2m delay'],
    },
    {
      id: 'seg-3',
      type: 'metro',
      title: 'Blue Line (U3)',
      duration: '15 mins',
      stops: 4,
      status: 'on-time',
      occupancy: 'low',
      features: ['On Time'],
    },
    {
      id: 'seg-4',
      type: 'bike',
      title: 'FlowBike Rental',
      duration: '7 mins',
      distance: '0.8 miles',
      status: 'available',
      features: ['Available'],
      nearbyStation: true,
    },
  ],
};

// Transport mode configurations
export const TRANSPORT_MODES = {
  walk: {
    icon: 'directions_walk',
    iconBg: 'primary-fixed',
    iconColor: 'on-primary-fixed',
    label: 'Walking',
  },
  bus: {
    icon: 'directions_bus',
    iconBg: 'secondary-fixed',
    iconColor: 'on-secondary-fixed',
    label: 'Bus',
  },
  metro: {
    icon: 'subway',
    iconBg: 'primary-container',
    iconColor: 'on-primary',
    label: 'Metro',
  },
  bike: {
    icon: 'directions_bike',
    iconBg: 'secondary-fixed-dim',
    iconColor: 'on-secondary-fixed',
    label: 'Bike',
  },
  train: {
    icon: 'train',
    iconBg: 'primary-container',
    iconColor: 'on-primary',
    label: 'Train',
  },
  car: {
    icon: 'directions_car',
    iconBg: 'tertiary-container',
    iconColor: 'on-tertiary',
    label: 'Car',
  },
  scooter: {
    icon: 'two_wheeler',
    iconBg: 'secondary-container',
    iconColor: 'on-secondary-container',
    label: 'Scooter',
  },
};

// Status configurations
export const STATUS_CONFIG = {
  'on-time': {
    label: 'On Time',
    bgColor: 'secondary-container',
    textColor: 'on-secondary-container',
  },
  delayed: {
    label: 'Delayed',
    bgColor: 'error-container',
    textColor: 'on-error-container',
  },
  cancelled: {
    label: 'Cancelled',
    bgColor: 'error',
    textColor: 'on-error',
  },
  available: {
    label: 'Available',
    bgColor: 'secondary-container',
    textColor: 'on-secondary-container',
  },
};

// Occupancy levels
export const OCCUPANCY_LEVELS = {
  low: {
    label: 'Low occupancy',
    icon: 'person',
    count: 1,
  },
  medium: {
    label: 'Medium occupancy',
    icon: 'group',
    count: 2,
  },
  high: {
    label: 'High occupancy',
    icon: 'group',
    count: 3,
  },
  full: {
    label: 'Full capacity',
    icon: 'crowd',
    count: 4,
  },
};

// Animation configurations
export const ANIMATION_CONFIG = {
  segmentTransition: {
    duration: 300,
    easing: 'ease-in-out',
  },
  pulseAnimation: {
    duration: 2000,
    iterations: 'infinite',
  },
  connectorAnimation: {
    dashLength: 4,
    gapLength: 4,
    animationDuration: 1000,
  },
};

// Layout constants
export const LAYOUT_CONSTANTS = {
  HEADER_HEIGHT: 80,
  SEGMENT_ICON_SIZE: 48,
  SEGMENT_ICON_CONTAINER_SIZE: 56,
  CONNECTOR_WIDTH: 2,
  CARD_PADDING: 20,
  BORDER_RADIUS: 16,
  MAP_PREVIEW_HEIGHT: 128,
};
