import { NOTIFICATION_TYPES } from '../utils/notificationTypes';

export const mockNotifications = [
  {
    id: '1',
    type: NOTIFICATION_TYPES.TRAFFIC,
    title: 'Traffic Alert',
    message: 'Heavy traffic on Route 101 North. Consider alternative routes to save 15 minutes.',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(), // 2 min ago
    isRead: false,
    isImportant: true,
    location: 'Route 101 North',
    estimatedDelay: '15 minutes',
    alternativeRoutes: ['Route 95', 'Local Streets'],
  },
  {
    id: '2',
    type: NOTIFICATION_TYPES.ROUTE,
    title: 'Route Optimized',
    message: 'Your daily commute route has been updated. New route saves 8 minutes.',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 min ago
    isRead: false,
    isImportant: false,
    routeFrom: 'Home',
    routeTo: 'Office',
    timeSaved: '8 minutes',
    newRoute: 'Express Lane via Highway 95',
  },
  {
    id: '3',
    type: NOTIFICATION_TYPES.TRANSIT,
    title: 'Metro Service Update',
    message: 'Line 2 is running on schedule. Next train arrives in 3 minutes.',
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(), // 12 min ago
    isRead: true,
    isImportant: false,
    line: 'Line 2',
    station: 'Central Station',
    nextArrival: '3 minutes',
    status: 'On Schedule',
  },
  {
    id: '4',
    type: NOTIFICATION_TYPES.BIKE,
    title: 'Bike Available',
    message: '5 bikes available at Central Station. Perfect weather for cycling!',
    timestamp: new Date(Date.now() - 24 * 60 * 60000).toISOString(), // 1 day ago
    isRead: true,
    isImportant: false,
    location: 'Central Station',
    availableBikes: 5,
    weather: 'Sunny, 22°C',
    bikeShare: 'CityBike',
  },
  {
    id: '5',
    type: NOTIFICATION_TYPES.PARKING,
    title: 'Parking Reminder',
    message: 'Your parking expires in 30 minutes. Extend or move your vehicle.',
    timestamp: new Date(Date.now() - 24 * 60 * 60000).toISOString(), // 1 day ago
    isRead: true,
    isImportant: true,
    location: 'Downtown Parking Lot',
    expiresIn: '30 minutes',
    zone: 'Zone A',
    cost: '$2.50/hour',
  },
  {
    id: '6',
    type: NOTIFICATION_TYPES.ALERT,
    title: 'Severe Weather Warning',
    message: 'Heavy rain expected in the next hour. Consider delaying your trip.',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 min ago
    isRead: false,
    isImportant: true,
    weatherType: 'Heavy Rain',
    duration: '1 hour',
    affectedAreas: ['Downtown', 'North District'],
    recommendations: ['Delay travel', 'Use public transit'],
  },
  {
    id: '7',
    type: NOTIFICATION_TYPES.UPDATE,
    title: 'App Update Available',
    message: 'New features include real-time traffic predictions and eco-route suggestions.',
    timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
    isRead: true,
    isImportant: false,
    version: '2.1.0',
    newFeatures: ['Traffic predictions', 'Eco-routes'],
    size: '15.2 MB',
  },
  {
    id: '8',
    type: NOTIFICATION_TYPES.REMINDER,
    title: 'Weekly Eco Report',
    message: 'You saved 2.3kg CO2 this week! View your detailed eco-impact report.',
    timestamp: new Date(Date.now() - 6 * 60 * 60000).toISOString(), // 6 hours ago
    isRead: false,
    isImportant: false,
    co2Saved: '2.3kg',
    period: 'This week',
    transportModes: ['Bike', 'Bus', 'Walking'],
    comparison: '15% better than last week',
  },
  {
    id: '9',
    type: NOTIFICATION_TYPES.TRANSIT,
    title: 'Bus Route Change',
    message: 'Bus 15 will now stop at the new Central Hub instead of Old Station.',
    timestamp: new Date(Date.now() - 8 * 60 * 60000).toISOString(), // 8 hours ago
    isRead: true,
    isImportant: false,
    busRoute: 'Bus 15',
    oldStop: 'Old Station',
    newStop: 'Central Hub',
    effectiveDate: 'Starting tomorrow',
  },
  {
    id: '10',
    type: NOTIFICATION_TYPES.ROUTE,
    title: 'Favorite Route Updated',
    message: 'Your favorite route to the gym now includes a new bike lane.',
    timestamp: new Date(Date.now() - 12 * 60 * 60000).toISOString(), // 12 hours ago
    isRead: true,
    isImportant: false,
    routeName: 'Gym Route',
    improvement: 'New bike lane',
    location: 'Park Avenue',
    estimatedTime: 'Same duration',
  },
];

export const getNotificationsByFilter = (filter, notifications = mockNotifications) => {
  switch (filter) {
    case 'unread':
      return notifications.filter(n => !n.isRead);
    case 'important':
      return notifications.filter(n => n.isImportant);
    case 'today':
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return notifications.filter(n => new Date(n.timestamp) >= todayStart);
    case 'thisWeek':
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60000);
      return notifications.filter(n => new Date(n.timestamp) >= weekAgo);
    default:
      return notifications;
  }
};

export const getNotificationsByType = (type, notifications = mockNotifications) => {
  if (!type || type === 'all') return notifications;
  return notifications.filter(n => n.type === type);
};

export const searchNotifications = (query, notifications = mockNotifications) => {
  if (!query) return notifications;
  
  const lowercaseQuery = query.toLowerCase();
  return notifications.filter(notification => 
    notification.title.toLowerCase().includes(lowercaseQuery) ||
    notification.message.toLowerCase().includes(lowercaseQuery) ||
    notification.type.toLowerCase().includes(lowercaseQuery)
  );
};
