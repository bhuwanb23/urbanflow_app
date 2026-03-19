/**
 * Internationalization (i18n) Configuration
 * English translations for route details screen
 */

export const en = {
  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    retry: 'Try Again',
    cancel: 'Cancel',
    confirm: 'Confirm',
  },

  // Route Details
  route: {
    title: 'UrbanFlow',
    startJourney: 'Start Journey',
    goBack: 'Go Back',
  },

  // Journey Overview
  journey: {
    duration: '{duration} • Arriving {arrivalTime}',
    from: 'From',
    to: 'To',
  },

  // Transport Modes
  transport: {
    walk: 'Walking',
    bus: 'Bus',
    metro: 'Metro',
    bike: 'Bike',
    train: 'Train',
    car: 'Car',
    scooter: 'Scooter',
  },

  // Status
  status: {
    onTime: 'On Time',
    delayed: 'Delayed',
    cancelled: 'Cancelled',
    available: 'Available',
    delayInfo: '{minutes}m delay',
  },

  // Segment Details
  segment: {
    distance: '{distance}',
    stops: '{stops} stops',
    duration: '{duration}',
    liveTracking: 'LIVE TRACKING ACTIVE',
    nearbyStation: 'STATION NEARBY',
    lane: 'LANE {number}',
  },

  // Occupancy
  occupancy: {
    low: 'Low occupancy',
    medium: 'Medium occupancy',
    high: 'High occupancy',
    full: 'Full capacity',
  },

  // Features
  features: {
    accessible: '♿ Accessible',
    free: 'Free',
    electric: '🌱 Electric',
    busy: '🔥 Busy',
  },

  // Map Preview
  map: {
    label: 'Mid-Route View',
    location: 'Map view of {location}',
  },

  // Error States
  errors: {
    generic: 'Oops! Something went wrong',
    routeNotFound: 'We couldn\'t load the route details',
    retryMessage: 'Please try again',
    networkError: 'Network error. Please check your connection.',
    locationPermission: 'Location permission is required for live tracking.',
  },

  // Accessibility Labels
  accessibility: {
    back: 'Go back',
    startJourney: 'Start journey',
    segmentDetails: '{type} segment: {title}',
    viewDetails: 'View details for {title}',
    statusBadge: 'Status: {status}',
    mapPreview: 'Map view of {location}',
    liveTracking: 'Live tracking active',
  },

  // Announcements
  announcements: {
    journeyStarted: 'Journey started. Live tracking is now active.',
    segmentComplete: 'Segment completed. Moving to next segment.',
    approachingDestination: 'Approaching destination.',
    delayDetected: 'Delay detected on your route.',
  },
};

export default en;
