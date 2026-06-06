/**
 * English translations (app-wide)
 * Mirrors the legacy pages/route/i18n/en.js content and adds
 * generic namespaces (common, errors, nav) for the rest of the
 * app.
 */

export const en = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    retry: 'Try Again',
    cancel: 'Cancel',
    confirm: 'Confirm',
    ok: 'OK',
    close: 'Close',
    refresh: 'Refresh',
    save: 'Save',
  },

  nav: {
    planner: 'Planner',
    live: 'Live',
    costats: 'Eco Stats',
    trips: 'Trips',
    profile: 'Profile',
  },

  route: {
    title: 'UrbanFlow',
    startJourney: 'Start Journey',
    goBack: 'Go Back',
  },

  journey: {
    duration: '{duration} • Arriving {arrivalTime}',
    from: 'From',
    to: 'To',
  },

  transport: {
    walk: 'Walking',
    bus: 'Bus',
    metro: 'Metro',
    bike: 'Bike',
    train: 'Train',
    car: 'Car',
    scooter: 'Scooter',
  },

  status: {
    onTime: 'On Time',
    delayed: 'Delayed',
    cancelled: 'Cancelled',
    available: 'Available',
    delayInfo: '{minutes}m delay',
  },

  segment: {
    distance: '{distance}',
    stops: '{stops} stops',
    duration: '{duration}',
    liveTracking: 'LIVE TRACKING ACTIVE',
    nearbyStation: 'STATION NEARBY',
    lane: 'LANE {number}',
  },

  occupancy: {
    low: 'Low occupancy',
    medium: 'Medium occupancy',
    high: 'High occupancy',
    full: 'Full capacity',
  },

  features: {
    accessible: 'Accessible',
    free: 'Free',
    electric: 'Electric',
    busy: 'Busy',
  },

  map: {
    label: 'Mid-Route View',
    location: 'Map view of {location}',
  },

  errors: {
    generic: 'Oops! Something went wrong',
    routeNotFound: 'We couldn\'t load the route details',
    retryMessage: 'Please try again',
    networkError: 'Network error. Please check your connection.',
    locationPermission: 'Location permission is required for live tracking.',
    offline: 'You are offline',
  },

  accessibility: {
    back: 'Go back',
    startJourney: 'Start journey',
    segmentDetails: '{type} segment: {title}',
    viewDetails: 'View details for {title}',
    statusBadge: 'Status: {status}',
    mapPreview: 'Map view of {location}',
    liveTracking: 'Live tracking active',
  },

  announcements: {
    journeyStarted: 'Journey started. Live tracking is now active.',
    segmentComplete: 'Segment completed. Moving to next segment.',
    approachingDestination: 'Approaching destination.',
    delayDetected: 'Delay detected on your route.',
  },
};

export default en;
