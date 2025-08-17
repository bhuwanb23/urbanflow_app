export const favoriteRoutes = [
  {
    id: 'fav1',
    from: 'Home',
    to: 'Office',
    eco: 95,
    duration: '25 min',
    modes: [
      { name: 'bike', color: '#10b981' },
      { name: 'train', color: '#6366f1' },
    ],
    gradient: ['#ede9fe', '#dbeafe'],
    border: '#ede9fe',
  },
  {
    id: 'fav2',
    from: 'Mall',
    to: 'Home',
    eco: 88,
    duration: '18 min',
    modes: [
      { name: 'bus', color: '#3b82f6' },
      { name: 'walk', color: '#64748b' },
    ],
    gradient: ['#dcfce7', '#d1fae5'],
    border: '#dcfce7',
  },
];

export const tripHistory = [
  {
    id: '1',
    from: 'Downtown',
    to: 'Airport',
    date: 'Today, 2:30 PM',
    eco: 72,
    duration: '45 min',
    modes: [
      { name: 'car', color: '#64748b' },
    ],
    cost: '$12.50',
    ecoColor: '#fb923c',
    ecoBg: '#fef3c7',
  },
  {
    id: '2',
    from: 'Home',
    to: 'Gym',
    date: 'Yesterday, 6:00 AM',
    eco: 95,
    duration: '15 min',
    modes: [
      { name: 'bike', color: '#10b981' },
    ],
    cost: 'Free',
    ecoColor: '#22c55e',
    ecoBg: '#dcfce7',
  },
  {
    id: '3',
    from: 'Office',
    to: 'Restaurant',
    date: 'Yesterday, 7:30 PM',
    eco: 85,
    duration: '22 min',
    modes: [
      { name: 'train', color: '#6366f1' },
      { name: 'walk', color: '#64748b' },
    ],
    cost: '$3.25',
    ecoColor: '#3b82f6',
    ecoBg: '#dbeafe',
  },
  {
    id: '4',
    from: 'Mall',
    to: 'Park',
    date: 'Dec 22, 3:15 PM',
    eco: 92,
    duration: '12 min',
    modes: [
      { name: 'bus', color: '#3b82f6' },
    ],
    cost: '$2.75',
    ecoColor: '#22c55e',
    ecoBg: '#dcfce7',
  },
];
