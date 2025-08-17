# 🔌 API Integration Guide

Quick guide to connect each page to its corresponding API endpoints.

## 📋 Page to API Mapping

| Page | API Module | Hook | Main Functions |
|------|------------|------|----------------|
| **LoginScreen** | `authAPI` | `useAuth` | `login`, `register` |
| **HomeScreen** | `tripsAPI`, `routesAPI`, `ecoStatsAPI` | `useTrips`, `useRoutes`, `useEcoStats` | `fetchTrips`, `fetchRoutes`, `fetchEcoStats` |
| **EcoStatsScreen** | `ecoStatsAPI` | `useEcoStats` | `getWeeklyStats`, `getMonthlyStats`, `getAchievements` |
| **TripsScreen** | `tripsAPI` | `useTrips` | `fetchTrips`, `createTrip`, `updateTrip`, `deleteTrip` |
| **PlannerScreen** | `routesAPI` | `useRoutes` | `fetchRoutes`, `searchRoutes`, `getPopularRoutes` |
| **LiveScreen** | `trafficAPI`, `demoAPI` | `useTraffic`, `useDemoData` | `fetchLiveTraffic`, `getTrafficConditions` |
| **NotificationsScreen** | `notificationsAPI` | `useNotifications` | `fetchNotifications`, `markAsRead`, `deleteNotification` |
| **ProfileScreen** | `userAPI`, `ecoStatsAPI` | `useAuth`, `useEcoStats` | `updateProfile`, `logout`, `fetchEcoStats` |
| **RouteDetailsScreen** | `routesAPI` | `useRoutes` | `getRoute`, `updateRoute` |

## 🚀 Quick Integration Examples

### 1. LoginScreen.js
```javascript
import { useAuth } from '../utils/hooks/useAPI';

export default function LoginScreen() {
  const { login, loading, error } = useAuth();
  
  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      // Navigation handled by App.js
    } catch (err) {
      console.log('Login failed:', err.message);
    }
  };
  
  return (
    <View>
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity onPress={() => handleLogin(credentials)} disabled={loading}>
        {loading ? <ActivityIndicator /> : <Text>Login</Text>}
      </TouchableOpacity>
    </View>
  );
}
```

### 2. HomeScreen.js
```javascript
import { useTrips, useRoutes, useEcoStats } from '../utils/hooks/useAPI';

export default function HomeScreen() {
  const { trips, fetchTrips, loading: tripsLoading } = useTrips();
  const { routes, fetchRoutes, loading: routesLoading } = useRoutes();
  const { ecoStats, fetchEcoStats, loading: statsLoading } = useEcoStats();

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    await Promise.all([
      fetchTrips({ limit: 5 }),
      fetchRoutes({ limit: 3 }),
      fetchEcoStats({ period: 'week' })
    ]);
  };

  return (
    <ScrollView>
      {tripsLoading || routesLoading || statsLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <RecentTrips trips={trips} />
          <SavedRoutes routes={routes} />
          <EcoStatsSummary stats={ecoStats} />
        </>
      )}
    </ScrollView>
  );
}
```

### 3. EcoStatsScreen.js
```javascript
import { useEcoStats } from '../utils/hooks/useAPI';

export default function EcoStatsScreen() {
  const { ecoStats, fetchEcoStats, getWeeklyStats, getMonthlyStats, loading, error } = useEcoStats();

  useEffect(() => {
    fetchEcoStats();
  }, []);

  const handlePeriodChange = async (period) => {
    if (period === 'week') await getWeeklyStats();
    else if (period === 'month') await getMonthlyStats();
    else await fetchEcoStats({ period });
  };

  return (
    <ScrollView>
      {error && <Text style={styles.error}>{error}</Text>}
      {loading ? <ActivityIndicator /> : <EcoStatsDisplay stats={ecoStats} />}
    </ScrollView>
  );
}
```

### 4. TripsScreen.js
```javascript
import { useTrips } from '../utils/hooks/useAPI';

export default function TripsScreen() {
  const { trips, fetchTrips, createTrip, updateTrip, deleteTrip, loading, error } = useTrips();

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleCreateTrip = async (tripData) => {
    try {
      await createTrip(tripData);
    } catch (err) {
      console.log('Error creating trip:', err.message);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      await deleteTrip(tripId);
    } catch (err) {
      console.log('Error deleting trip:', err.message);
    }
  };

  return (
    <ScrollView>
      {error && <Text style={styles.error}>{error}</Text>}
      {loading ? <ActivityIndicator /> : (
        trips.map(trip => (
          <TripCard key={trip.id} trip={trip} onDelete={() => handleDeleteTrip(trip.id)} />
        ))
      )}
    </ScrollView>
  );
}
```

### 5. LiveScreen.js
```javascript
import { useTraffic, useDemoData } from '../utils/hooks/useAPI';

export default function LiveScreen() {
  const { trafficData, fetchLiveTraffic, getTrafficConditions, loading, error } = useTraffic();
  const { demoData, fetchTrafficData, loading: demoLoading } = useDemoData();

  useEffect(() => {
    loadLiveData();
  }, []);

  const loadLiveData = async () => {
    try {
      await fetchLiveTraffic();
    } catch (err) {
      // Fallback to demo data
      await fetchTrafficData();
    }
  };

  return (
    <ScrollView>
      {error && <Text style={styles.error}>{error}</Text>}
      {loading || demoLoading ? <ActivityIndicator /> : (
        <>
          <LiveMap trafficData={trafficData || demoData?.traffic} />
          <TrafficConditions conditions={trafficData?.conditions || demoData?.traffic?.conditions} />
        </>
      )}
    </ScrollView>
  );
}
```

### 6. PlannerScreen.js
```javascript
import { useRoutes } from '../utils/hooks/useAPI';

export default function PlannerScreen({ navigation }) {
  const { routes, fetchRoutes, searchRoutes, getPopularRoutes, loading, error } = useRoutes();

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    await Promise.all([
      fetchRoutes({ isActive: true }),
      getPopularRoutes()
    ]);
  };

  const handleRoutePress = (route) => {
    navigation.navigate('RouteDetailsScreen', { route });
  };

  return (
    <ScrollView>
      {error && <Text style={styles.error}>{error}</Text>}
      {loading ? <ActivityIndicator /> : (
        routes.map(route => (
          <RouteCard key={route.id} route={route} onPress={() => handleRoutePress(route)} />
        ))
      )}
    </ScrollView>
  );
}
```

### 7. NotificationsScreen.js
```javascript
import { useNotifications } from '../utils/hooks/useAPI';

export default function NotificationsScreen() {
  const { notifications, fetchNotifications, markAsRead, deleteNotification, loading, error } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (err) {
      console.log('Error marking as read:', err.message);
    }
  };

  return (
    <ScrollView>
      {error && <Text style={styles.error}>{error}</Text>}
      {loading ? <ActivityIndicator /> : (
        notifications.map(notification => (
          <NotificationCard 
            key={notification.id} 
            notification={notification}
            onPress={() => handleMarkAsRead(notification.id)}
          />
        ))
      )}
    </ScrollView>
  );
}
```

### 8. ProfileScreen.js
```javascript
import { useAuth, useEcoStats } from '../utils/hooks/useAPI';

export default function ProfileScreen() {
  const { user, updateProfile, logout, loading: authLoading, error: authError } = useAuth();
  const { ecoStats, fetchEcoStats, loading: statsLoading } = useEcoStats();

  useEffect(() => {
    fetchEcoStats({ period: 'all' });
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.log('Error during logout:', err.message);
    }
  };

  return (
    <ScrollView>
      {authError && <Text style={styles.error}>{authError}</Text>}
      <ProfileCard user={user} />
      {statsLoading ? <ActivityIndicator /> : <SustainabilityCard stats={ecoStats} />}
      <LogoutButton onPress={handleLogout} loading={authLoading} />
    </ScrollView>
  );
}
```

## ⚙️ Configuration

### Update API Base URL
In `utils/api.js`:
```javascript
const API_CONFIG = {
  BASE_URL: 'http://192.168.31.67:3000', // Update to your server IP
  VERSION: 'v1',
  TIMEOUT: 10000,
};
```

## 🎯 Key Features

- ✅ **Automatic token management** - JWT tokens handled automatically
- ✅ **Loading states** - Built-in loading state management
- ✅ **Error handling** - Consistent error handling across all APIs
- ✅ **State management** - Automatic state updates after API calls
- ✅ **Offline support** - Demo data fallback for offline scenarios

## 🚀 Quick Start

1. **Import hooks** in your page components
2. **Replace hardcoded data** with API calls
3. **Add loading states** and error handling
4. **Test the integration** with your server

---

**That's it! Your pages are now connected to the API! 🎉**
