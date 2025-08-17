const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

// Main seeding function
const seedSampleData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Import all models to ensure they're registered with Sequelize
    const { User, Trip, Route, EcoStats, Notification, LiveTraffic } = require('../models');

    // Sync database (create tables)
    await sequelize.sync({ force: true });
    console.log('✅ Database tables created');

    // Sample user data
    const sampleUsers = [
      {
        name: 'Alex Johnson',
        email: 'alex@urbanflow.com',
        password: 'password123',
        avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
        city: 'Mumbai',
        country: 'India',
        latitude: 19.0760,
        longitude: 72.8777,
        preferredTransport: [
          { mode: 'train', priority: 1 },
          { mode: 'bus', priority: 2 },
          { mode: 'walk', priority: 3 }
        ],
        dailyCO2Target: 5.0,
        weeklyWalkingTarget: 50,
        monthlyPublicTransportTarget: 100,
        ecoScoreTarget: 85
      },
      {
        name: 'Bhuwan B',
        email: 'bhuwan.b@urbanflow.com',
        password: 'password123',
        avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
        city: 'Mumbai',
        country: 'India',
        latitude: 19.0760,
        longitude: 72.8777,
        preferredTransport: [
          { mode: 'metro', priority: 1 },
          { mode: 'bike', priority: 2 },
          { mode: 'walk', priority: 3 }
        ],
        dailyCO2Target: 6.0,
        weeklyWalkingTarget: 60,
        monthlyPublicTransportTarget: 120,
        ecoScoreTarget: 90
      }
    ];

    // Sample trip data
    const sampleTrips = [
      {
        fromName: 'Downtown Station',
        fromLatitude: 19.0760,
        fromLongitude: 72.8777,
        toName: 'Airport Terminal',
        toLatitude: 19.0896,
        toLongitude: 72.8656,
        startTime: new Date('2024-01-15T08:30:00Z'),
        endTime: new Date('2024-01-15T09:02:00Z'),
        actualDuration: 32,
        estimatedDuration: 30,
        actualDistance: 5.2,
        estimatedDistance: 5.0,
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
        co2Saved: 2.3,
        cost: 35,
        status: 'completed',
        rating: 4
      }
    ];

    // Sample route data
    const sampleRoutes = [
      {
        name: 'Daily Commute',
        fromName: 'Home',
        fromLatitude: 19.0760,
        fromLongitude: 72.8777,
        toName: 'Office',
        toLatitude: 19.0896,
        toLongitude: 72.8656,
        modes: ['walk', 'train', 'walk'],
        duration: 30,
        distance: 5.2,
        cost: 35,
        ecoScore: 85,
        isFavorite: true
      }
    ];

    // Sample eco stats data
    const sampleEcoStats = [
      {
        date: new Date('2024-01-15'),
        totalCO2Saved: 2.3,
        totalDistanceWalked: 0.65,
        totalPublicTransportTrips: 1,
        averageEcoScore: 85,
        tripsCount: 1,
        totalCost: 35
      }
    ];

    // Sample notification data
    const sampleNotifications = [
      {
        title: 'Welcome to UrbanFlow!',
        message: 'Start your sustainable journey today. Track your trips and see your environmental impact.',
        type: 'system',
        priority: 'medium'
      },
      {
        title: 'Great Eco Score!',
        message: 'Your trip had an eco score of 85. Keep up the great work!',
        type: 'achievement',
        priority: 'low'
      }
    ];

    // Sample traffic data
    const sampleTraffic = [
      {
        city: 'Mumbai',
        area: 'Downtown',
        latitude: 19.0760,
        longitude: 72.8777,
        trafficLevel: 'moderate',
        congestionIndex: 45,
        averageSpeed: 25.5,
        description: 'Moderate traffic on main roads'
      }
    ];

    // Create users
    console.log('👥 Creating sample users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }

    // Create trips for each user
    console.log('🚗 Creating sample trips...');
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      for (const tripData of sampleTrips) {
        const trip = await Trip.create({
          ...tripData,
          userId: user.id
        });
        console.log(`✅ Created trip: ${trip.fromName} to ${trip.toName}`);
      }
    }

    // Create routes for each user
    console.log('🛣️ Creating sample routes...');
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      for (const routeData of sampleRoutes) {
        const route = await Route.create({
          ...routeData,
          userId: user.id
        });
        console.log(`✅ Created route: ${route.name}`);
      }
    }

    // Create eco stats for each user
    console.log('🌱 Creating sample eco stats...');
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      for (const statsData of sampleEcoStats) {
        const stats = await EcoStats.create({
          ...statsData,
          userId: user.id
        });
        console.log(`✅ Created eco stats for ${stats.date}`);
      }
    }

    // Create notifications for each user
    console.log('🔔 Creating sample notifications...');
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      for (const notificationData of sampleNotifications) {
        const notification = await Notification.create({
          ...notificationData,
          userId: user.id
        });
        console.log(`✅ Created notification: ${notification.title}`);
      }
    }

    // Create traffic data
    console.log('🚦 Creating sample traffic data...');
    for (const trafficData of sampleTraffic) {
      const traffic = await LiveTraffic.create(trafficData);
      console.log(`✅ Created traffic data for ${traffic.city} - ${traffic.area}`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Sample data created:');
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   🚗 Trips: ${createdUsers.length * sampleTrips.length}`);
    console.log(`   🛣️ Routes: ${createdUsers.length * sampleRoutes.length}`);
    console.log(`   🌱 Eco Stats: ${createdUsers.length * sampleEcoStats.length}`);
    console.log(`   🔔 Notifications: ${createdUsers.length * sampleNotifications.length}`);
    console.log(`   🚦 Traffic Data: ${sampleTraffic.length}`);

    console.log('\n🔑 Demo Credentials:');
    createdUsers.forEach(user => {
      console.log(`   ${user.name}: ${user.email} / password123`);
    });

    console.log('\n🚀 You can now start the server with: npm run dev');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Export the seeding function
module.exports = {
  seedSampleData
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedSampleData()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}
