const bcrypt = require('bcryptjs');
const { initializeDatabase } = require('../models');

async function seed() {
  const { User, Trip, Notification } = await initializeDatabase();

  const existing = await User.findOne({ where: { email: 'demo@urbanflow.com' } });
  if (existing) {
    console.log('Demo user already exists, skipping seed.');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash('demo123', 10);
  const user = await User.create({
    email: 'demo@urbanflow.com',
    password: hashedPassword,
    name: 'Demo User',
    phone: '+91 9876543210',
    preferences: {
      language: 'en',
      currency: 'INR',
      mobilityGoals: ['reduce_carbon', 'save_money'],
      preferredTransport: ['bus', 'train'],
      accessibilityNeeds: [],
      notificationsEnabled: true
    }
  });
  console.log(`Created demo user: ${user.email} (${user.id})`);

  const now = Date.now();
  const demoNotifications = [
    { userId: user.id, title: 'Service Disruption', description: 'Bus route 502-A delayed by 15 minutes due to traffic congestion on Outer Ring Road.', category: 'delay', urgency: 'warning', icon: 'alert-circle' },
    { userId: user.id, title: 'Carbon Warrior Unlocked!', description: 'You\'ve saved 20 kg of CO2 this month. Keep up the great work!', category: 'achievement', urgency: 'info', icon: 'leaf' },
    { userId: user.id, title: 'Complete Your Journey', description: 'You started a trip 30 minutes ago. Don\'t forget to mark it as completed!', category: 'system', urgency: 'info', icon: 'information-outline', read: true, createdAt: new Date(now - 5 * 3600000) },
    { userId: user.id, title: 'Heavy Rain Alert', description: 'Expected heavy rainfall in Bengaluru this evening.', category: 'weather', urgency: 'warning', icon: 'weather-lightning-rainy', read: true, createdAt: new Date(now - 86400000) },
    { userId: user.id, title: 'Weekly Challenge', description: 'Take 10 bus trips this week and unlock the Green Commuter badge!', category: 'eco_tip', urgency: 'info', icon: 'trophy', read: true, createdAt: new Date(now - 172800000) },
  ];
  for (const n of demoNotifications) {
    await Notification.create(n);
  }
  console.log(`Created ${demoNotifications.length} demo notifications`);

  const demoTrips = [
    { userId: user.id, fromName: 'MG Road', fromLat: 12.9716, fromLon: 77.5946, toName: 'Indiranagar', toLat: 12.9716, toLon: 77.6412, distance: 5.2, duration: 25, mode: 'bus', carbonSaved: 1.2, cost: 25, caloriesBurned: 45, status: 'completed', date: new Date(now - 172800000) },
    { userId: user.id, fromName: 'Koramangala', fromLat: 12.9352, fromLon: 77.6245, toName: 'Silk Board', toLat: 12.9176, toLon: 77.6238, distance: 8.5, duration: 35, mode: 'bus', carbonSaved: 2.1, cost: 40, caloriesBurned: 120, status: 'completed', date: new Date(now - 86400000) },
    { userId: user.id, fromName: 'Whitefield', fromLat: 12.9698, fromLon: 77.7499, toName: 'KR Puram', toLat: 13.0389, toLon: 77.6978, distance: 12.3, duration: 45, mode: 'multimodal', legs: [{ mode: 'walk', distance: 0.5, duration: 6 }, { mode: 'bus', distance: 10.8, duration: 35 }, { mode: 'walk', distance: 1.0, duration: 4 }], carbonSaved: 3.5, cost: 35, caloriesBurned: 180, status: 'completed', date: new Date(now - 18000000) },
  ];
  for (const t of demoTrips) {
    await Trip.create(t);
  }
  console.log(`Created ${demoTrips.length} demo trips`);

  console.log('Seed complete!');
  process.exit(0);
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
