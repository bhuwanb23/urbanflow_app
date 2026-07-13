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

  profile: {
    title: 'My Profile',
    sustainabilityImpact: 'Sustainability Impact',
    account: 'Account',
    preferences: 'Preferences',
    city: 'City',
    editProfile: 'Edit Profile',
    notifications: 'Notifications',
    privacy: 'Privacy & Security',
    preferredTransport: 'Preferred Transport',
    mobilityGoals: 'Mobility Goals',
    languageRegion: 'Language & Region',
    logout: 'Log Out',
    co2Saved: 'CO₂ Saved',
    treesEquivalent: 'Trees Equivalent',
    ecoScore: 'Eco Score',
  },

  planner: {
    title: 'Plan Your Journey',
    searchPlaceholder: 'Search destination...',
    quickActions: 'Quick Actions',
    popularRoutes: 'Popular Routes',
    searchErrorTitle: 'Search Error',
    searchErrorMessage: 'Unable to search routes. Please try again.',
  },

  live: {
    title: 'Live Transit',
    trafficConditions: 'Traffic Conditions',
    recentUpdates: 'Recent Updates',
    popularRoutes: 'Popular Routes',
    transitStatus: 'Transit Status',
    airQuality: 'Air Quality',
    realtimeActivity: 'Real-Time Activity',
    viewArchive: 'VIEW ARCHIVE',
    allClear: 'All clear',
    noActiveAlerts: 'No active alerts right now',
  },

  ecostats: {
    title: 'Eco Stats',
    achievements: 'Achievements',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    carbonFootprint: 'Carbon Footprint',
    loadError: 'Couldn’t load your eco stats.',
  },

  notifications: {
    title: 'Notifications',
    emptyTitle: 'No notifications yet',
    emptyMessage: 'Stay tuned for updates about your routes, traffic conditions, and transit information.',
    today: 'Today',
    yesterday: 'Yesterday',
    older: 'Older',
  },

  trips: {
    title: 'Your Trips',
    subtitle: 'Track your journey history',
    savedRoutes: 'Saved Routes',
    recentTrips: 'Recent Trips',
    noTrips: 'No trips yet',
    noTripsMessage: 'Plan a route to start building your journey history.',
    noSavedRoutes: 'No saved routes yet. Start planning journeys!',
    seeAll: 'See All',
    viewAllHistory: 'View All History',
  },

  intro: {
    title: 'UrbanFlow',
    smartMobility: 'Smart Mobility.',
    zeroCompromise: 'Zero Compromise.',
    description: 'Navigate your city efficiently while reducing your carbon footprint. Intelligent routing for the modern commuter.',
    getStarted: 'Get Started',
  },
};

export default en;
