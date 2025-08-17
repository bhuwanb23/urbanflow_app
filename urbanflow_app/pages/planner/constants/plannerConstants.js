export const MODES = [
  { key: 'train', label: 'Train', icon: 'train' },
  { key: 'bus', label: 'Bus', icon: 'bus' },
  { key: 'auto', label: 'Auto', icon: 'car' },
  { key: 'walk', label: 'Walk', icon: 'walk' },
  { key: 'all', label: 'All', icon: 'view-grid' },
];

export const ACTIONS = [
  { name: 'Home', icon: 'home', color: '#6366f1' },
  { name: 'Work', icon: 'briefcase', color: '#10b981' },
  { name: 'Favorites', icon: 'heart', color: '#f59e0b' },
  { name: 'Recent', icon: 'history', color: '#8b5cf6' },
];

export const ROUTES = [
  {
    id: '1',
    from: 'Connaught Place',
    to: 'India Gate',
    modes: ['train', 'bus'],
    time: '25 min',
    cost: '₹35',
    eco: '8.5',
    ecoColor: '#10B981',
    duration: '25 min',
    distance: '5.2 km',
  },
  {
    id: '2',
    from: 'Rajiv Chowk',
    to: 'Karol Bagh',
    modes: ['train'],
    time: '15 min',
    cost: '₹20',
    eco: '9.2',
    ecoColor: '#10B981',
    duration: '15 min',
    distance: '3.8 km',
  },
  {
    id: '3',
    from: 'Khan Market',
    to: 'Lajpat Nagar',
    modes: ['bus', 'auto'],
    time: '18 min',
    cost: '₹45',
    eco: '7.8',
    ecoColor: '#10B981',
    duration: '18 min',
    distance: '4.5 km',
  },
];
