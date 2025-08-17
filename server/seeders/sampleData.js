const bcrypt = require('bcryptjs');
const { User, Trip, Route, EcoStats, Notification, LiveTraffic } = require('../models');

// Sample user data
const sampleUsers = [
  {
    name: 'Alex Johnson',
    email: 'alex@urbanflow.com',
    password: 'password123',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
    location: {
      city: 'Mumbai',
      country: 'India',
      coordinates: { latitude: 19.0760, longitude: 72.8777 }
    },
    preferredTransport: [
      { mode: 'train', priority: 1 },
      { mode: 'bus', priority: 2 },
      { mode: 'walk', priority: 3 }
    ],
    sustainabilityGoals: {
      dailyCO2Target: 5.0,
      weeklyWalkingTarget: 50,
      monthlyPublicTransportTarget: 100,
      ecoScoreTarget: 85
    }
  },
  {
    name: 'Bhuwan B',
    email: 'bhuwan.b@urbanflow.com',
    password: 'password123',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
    location: {
      city: 'Mumbai',
      country: 'India',
      coordinates: { latitude: 19.0760, longitude: 72.8777 }
    },
    preferredTransport: [
      { mode: 'metro', priority: 1 },
      { mode: 'bike', priority: 2 },
      { mode: 'walk', priority: 3 }
    ],
    sustainabilityGoals: {
      dailyCO2Target: 6.0,
      weeklyWalkingTarget: 60,
      monthlyPublicTransportTarget: 120,
      ecoScoreTarget: 90
    }
  }
];

// Sample trip data
const sampleTrips = [
  {
    userId: null, // Will be set after user creation
    from: {
      name: 'Downtown Station',
      coordinates: { latitude: 19.0760, longitude: 72.8777 }
    },
    to: {
      name: 'Airport Terminal',
      coordinates: { latitude: 19.0896, longitude: 72.8656 }
    },
    startTime: new Date('2024-01-15T08:30:00Z'),
    endTime: new Date('2024-01-15T09:02:00Z'),
    duration: { actual: 32, estimated: 30 },
    distance: { actual: 5.2, estimated: 5.0 },
    modes: [
      {
        type: 'walk',
        duration: 5,
        distance: 0.45,
        cost: { amount: 0, currency: 'INR' }
      },
      {
        type: 'train',
        name: 'Metro Blue Line',
        duration: 18,
        stops: 6,
        cost: { amount: 20, currency: 'INR' },
        accessibility: true,
        busy: true
      },
      {
        type: 'bus',
        name: 'Express Bus 45',
        duration: 12,
        cost: { amount: 15, currency: 'INR' },
        accessibility: true,
        electric: true
      },
      {
        type: 'walk',
        duration: 3,
        distance: 0.2,
        cost: { amount: 0, currency: 'INR' }
      }
    ],
    environmentalImpact: {
      co2Saved: 2.3,
      ecoScore: 85,
      comparison: { vsCar: 2.3, vsPublicTransport: 85 }
    },
    totalCost: {
      amount: 35,
      currency: 'INR',
      breakdown: [
        { mode: 'train', amount: 20, description: 'Metro fare' },
        { mode: 'bus', amount: 15, description: 'Bus fare' }
      ]
    },
    status: 'completed',
    tags: ['work', 'daily', 'eco-friendly']
  }
];

// Sample eco stats data
const sampleEcoStats = [
  {
    userId: null, // Will be set after user creation
    period: {
      type: 'weekly',
      startDate: new Date('2024-01-08'),
      endDate: new Date('2024-01-14'),
      year: 2024,
      month: 1,
      week: 2,
      day: 14
    },
    co2Saved: {
      total: 14.2,
      daily: 2.0,
      weekly: 14.2,
      monthly: 56.8,
      vsCar: 14.2,
      vsPublicTransport: 85
    },
    distanceWalked: {
      total: 12.8,
      daily: 1.8,
      weekly: 12.8,
      monthly: 51.2
    },
    publicTransportTrips: {
      total: 28,
      daily: 4,
      weekly: 28,
      monthly: 112,
      breakdown: {
        bus: 15,
        train: 10,
        metro: 3,
        ferry: 0
      }
    },
    ecoScore: {
      current: 85,
      average: 82,
      trend: 3.7,
      grade: 'A'
    },
    achievements: [
      {
        id: 'green_commuter',
        title: 'Green Commuter',
        subtitle: '15 eco-friendly trips',
        icon: 'medal',
        gradientColors: ['#10B981', '#059669'],
        isCompleted: true,
        unlockedAt: new Date('2024-01-12')
      },
      {
        id: 'step_master',
        title: 'Step Master',
        subtitle: '10,000+ steps daily',
        icon: 'trophy',
        gradientColors: ['#3B82F6', '#2563EB'],
        isCompleted: true,
        unlockedAt: new Date('2024-01-10')
      }
    ]
  }
];

// Sample notification data
const sampleNotifications = [
  {
    userId: null, // Will be set after user creation
    title: 'Traffic Alert',
    message: 'Light traffic on Highway 101 - 3 min delay',
    type: 'traffic_alert',
    category: 'normal',
    icon: 'alert-triangle',
    iconColor: '#f97316',
    backgroundColor: '#fef3c7',
    isActionable: true,
    actionData: {
      screen: 'LiveScreen',
      route: 'traffic'
    }
  },
  {
    userId: null, // Will be set after user creation
    title: 'Achievement Unlocked!',
    message: 'Congratulations! You\'ve earned the Green Commuter badge',
    type: 'achievement_unlock',
    category: 'important',
    icon: 'trophy',
    iconColor: '#10b981',
    backgroundColor: '#dcfce7',
    isActionable: true,
    actionData: {
      screen: 'EcoStatsScreen',
      route: 'achievements'
    }
  }
];

// Sample live traffic data
const sampleLiveTraffic = [
  {
    location: {
      city: 'Mumbai',
      region: 'Maharashtra',
      country: 'India',
      coordinates: { latitude: 19.0760, longitude: 72.8777 },
      area: 'Downtown'
    },
    route: {
      id: 'HWY_101',
      name: 'Highway 101',
      type: 'highway',
      from: 'Downtown',
      to: 'Airport'
    },
    trafficConditions: {
      level: 'medium',
      severity: 'minor',
      description: 'Light traffic with minor delays',
      color: '#f59e0b',
      backgroundColor: '#fef3c7',
      icon: 'alert-circle'
    },
    currentMetrics: {
      averageSpeed: 45,
      travelTime: 25,
      delay: 3,
      congestionIndex: 35,
      vehicleCount: 1200,
      queueLength: 150
    },
    historicalComparison: {
      normalTravelTime: 22,
      normalSpeed: 50,
      timeIncrease: 13.6,
      speedDecrease: 10,
      isWorseThanUsual: true
    },
    dataQuality: {
      confidence: 85,
      source: 'sensor_network',
      lastUpdated: new Date(),
      updateFrequency: 5,
      isRealTime: true
    }
  }
];

// Seeder function
const seedSampleData = async () => {
  try {
    console.log('🌱 Starting to seed sample data...');

    // Clear existing data
    await User.deleteMany({});
    await Trip.deleteMany({});
    await EcoStats.deleteMany({});
    await Notification.deleteMany({});
    await LiveTraffic.deleteMany({});
    await Route.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`👤 Created user: ${savedUser.name}`);
    }

    // Create trips with user references
    for (const tripData of sampleTrips) {
      const trip = new Trip({
        ...tripData,
        userId: createdUsers[0]._id
      });
      await trip.save();
      console.log(`🚗 Created trip: ${tripData.from.name} to ${tripData.to.name}`);
    }

    // Create eco stats with user references
    for (const statsData of sampleEcoStats) {
      const ecoStats = new EcoStats({
        ...statsData,
        userId: createdUsers[0]._id
      });
      await ecoStats.save();
      console.log(`🌱 Created eco stats for user: ${createdUsers[0].name}`);
    }

    // Create notifications with user references
    for (const notificationData of sampleNotifications) {
      const notification = new Notification({
        ...notificationData,
        userId: createdUsers[0]._id
      });
      await notification.save();
      console.log(`🔔 Created notification: ${notificationData.title}`);
    }

    // Create live traffic data
    for (const trafficData of sampleLiveTraffic) {
      const liveTraffic = new LiveTraffic(trafficData);
      await liveTraffic.save();
      console.log(`🚦 Created live traffic data for: ${trafficData.route.name}`);
    }

    console.log('✅ Sample data seeding completed successfully!');
    console.log(`📊 Created ${createdUsers.length} users, ${sampleTrips.length} trips, ${sampleEcoStats.length} eco stats, ${sampleNotifications.length} notifications, and ${sampleLiveTraffic.length} live traffic entries`);

  } catch (error) {
    console.error('❌ Error seeding sample data:', error);
    throw error;
  }
};

// Export seeder function
module.exports = { seedSampleData };
