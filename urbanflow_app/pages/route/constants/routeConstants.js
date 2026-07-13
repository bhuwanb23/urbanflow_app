/**
 * Route Constants
 * Based on the route.html prototype design
 */

// Transport mode configurations
export const TRANSPORT_MODES = {
  walk: {
    icon: 'walk',
    iconBg: 'primary-fixed',
    iconColor: 'on-primary-fixed',
    label: 'Walking',
  },
  bus: {
    icon: 'bus',
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
    icon: 'bike',
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
    icon: 'car',
    iconBg: 'tertiary-container',
    iconColor: 'on-tertiary',
    label: 'Car',
  },
  scooter: {
    icon: 'scooter',
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
