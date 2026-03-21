# 🔍 Complete App Data Integration Audit

**Date:** March 21, 2026  
**Goal:** Verify ALL pages use REAL backend data (no mock/static data)

---

## 📊 Current Status Summary

### ✅ **FULLY CONNECTED Pages (Using Real API)**

#### 1. **EcoStats Screen** ✅
**File:** `pages/ecostats/EcoStatsScreen.js`
**API Connection:** ✅ Using `useEcoStats()` hook
**Endpoints Used:**
- `/api/v1/ecostats?period=week` ✅
- `/api/v1/ecostats/achievements` ✅

**Status:** Already connected to real backend!

---

#### 2. **Home Screen** ✅
**File:** `pages/home/HomeScreen.js`
**API Connection:** ✅ Using multiple hooks
**Endpoints Used:**
- `useAuth()` - User authentication
- `useTrips()` - Recent trips
- `useRoutes()` - Favorite routes
- `useEcoStats()` - Weekly stats

**Status:** Already connected to real backend!

---

### ❌ **NOT CONNECTED Pages (Using Mock Data)**

#### 1. **Profile Screen** ❌
**File:** `pages/profile/ProfileScreen.js`
**Current Status:** Using MOCK_DATA
**Lines 15-37:** Hardcoded mock data:
```javascript
const MOCK_PROFILE = { name: 'Bhuwan Chandra', email: 'bhuwan@urbanflow.eco' };
const ACCOUNT_SETTINGS = [ ... ]; // Static array
const PREFERENCES_SETTINGS = [ ... ]; // Static array
const SUSTAINABILITY_DATA = [ ... ]; // Static array
```

**What Needs to Change:**
- Replace `MOCK_PROFILE` with `userAPI.getProfile()`
- Fetch settings dynamically from user preferences
- Load sustainability data from trips API + ecoStats API

**Required Backend Endpoints:**
- `GET /api/v1/user/profile` ✅ Available
- `GET /api/v1/user/preferences` ✅ Available
- `GET /api/v1/trips/stats` ✅ Available

---

#### 2. **Trips Screen** ❌
**File:** `pages/trips/TripsScreen.js`
**Current Status:** Using MOCK_TRIPS
**Lines 11-77:** Hardcoded mock data:
```javascript
const favoriteRoutes = [ ... ]; // Static array
const MOCK_TRIPS = [ ... ]; // 3 hardcoded trips
```

**What Needs to Change:**
- Replace `favoriteRoutes` with `routesAPI.getRoutes({ isFavorite: true })`
- Replace `MOCK_TRIPS` with `tripsAPI.getTrips()`
- Add auto-save for completed journeys using `tripsAPI.createTrip()`

**Required Backend Endpoints:**
- `GET /api/v1/routes?isFavorite=true` ✅ Available
- `GET /api/v1/trips` ✅ Available
- `POST /api/v1/trips` ✅ Available (for saving new trips)
- `GET /api/v1/trips/stats` ✅ Available

---

#### 3. **Notifications Screen** ❌
**File:** `pages/notifications/NotificationsScreen.js`
**Current Status:** Using mockNotifications
**Line 12:** Importing mock data:
```javascript
import { mockNotifications, getNotificationsByFilter } from './data/mockNotifications';
```
**Line 22:** State initialized with mock data:
```javascript
const [notifications, setNotifications] = useState(mockNotifications);
```

**What Needs to Change:**
- Replace mock import with `useNotifications()` hook
- Fetch real notifications from backend
- Connect mark-as-read to API
- Connect delete to API

**Required Backend Endpoints:**
- `GET /api/v1/notifications` ✅ Available
- `PUT /api/v1/notifications/:id/read` ✅ Available
- `DELETE /api/v1/notifications/:id` ✅ Available
- `GET /api/v1/notifications/settings` ✅ Available

---

## 📋 Detailed Integration Tasks

### Task 1: Profile Screen Integration
**Priority:** HIGH  
**Estimated Time:** 2 hours

**Current Issues:**
1. Lines 15-19: `MOCK_PROFILE` static data
2. Lines 21-25: `ACCOUNT_SETTINGS` static array
3. Lines 27-31: `PREFERENCES_SETTINGS` static array
4. Lines 33-37: `SUSTAINABILITY_DATA` static array
5. Line 40: State uses mock data
6. Lines 44-50: Fake loading simulation

**Implementation Steps:**

**Step 1:** Import API hooks
```javascript
import { useUser, useTrips } from '../../utils/hooks/useAPI';
```

**Step 2:** Replace mock data with hooks
```javascript
const { user, loading: userLoading } = useUser();
const { trips } = useTrips();

// Calculate sustainability from real trips
const sustainabilityData = useMemo(() => {
  if (!trips) return [];
  const carbonSaved = trips.reduce((sum, t) => sum + (t.carbonSaved || 0), 0);
  return [
    { icon: 'leaf', label: 'CO₂ Saved', value: `${carbonSaved.toFixed(1)} kg`, ... },
    // ... more calculations
  ];
}, [trips]);
```

**Step 3:** Update useEffect
```javascript
useEffect(() => {
  // Remove fake loading
  // Data loads automatically via hooks
}, []);
```

**Step 4:** Pass real data to components
```javascript
<ProfileCard profile={user} ... />
<SustainabilityCard sustainabilityData={sustainabilityData} ... />
```

---

### Task 2: Trips Screen Integration
**Priority:** HIGH  
**Estimated Time:** 3 hours

**Current Issues:**
1. Lines 11-38: `favoriteRoutes` static array
2. Lines 40-77: `MOCK_TRIPS` static array
3. Line 84: State uses mock data
4. No API integration at all

**Implementation Steps:**

**Step 1:** Import API hooks
```javascript
import { useTrips, useRoutes } from '../../utils/hooks/useAPI';
```

**Step 2:** Replace static data
```javascript
const { 
  trips, 
  fetchTrips, 
  createTrip,
  loading: tripsLoading 
} = useTrips();

const { 
  routes, 
  fetchRoutes 
} = useRoutes();

// Get favorite routes
const favoriteRoutes = routes?.filter(r => r.isFavorite) || [];
```

**Step 3:** Add filtering logic
```javascript
const filteredTrips = useMemo(() => {
  if (!trips) return [];
  
  switch (selectedFilter) {
    case 'This Week':
      return trips.filter(t => isThisWeek(new Date(t.date)));
    case 'This Month':
      return trips.filter(t => isThisMonth(new Date(t.date)));
    case 'Eco-Friendly':
      return trips.filter(t => t.carbonSaved > 5);
    default:
      return trips;
  }
}, [trips, selectedFilter]);
```

**Step 4:** Auto-save completed journeys
```javascript
const saveCompletedJourney = async (journeyData) => {
  try {
    await createTrip({
      from: journeyData.from,
      to: journeyData.to,
      distance: journeyData.distance,
      duration: journeyData.duration,
      mode: journeyData.primaryMode,
      carbonSaved: calculateCarbon(journeyData),
      cost: journeyData.fare,
      caloriesBurned: calculateCalories(journeyData)
    });
  } catch (error) {
    console.error('Error saving trip:', error);
  }
};
```

---

### Task 3: Notifications Screen Integration
**Priority:** HIGH  
**Estimated Time:** 2 hours

**Current Issues:**
1. Line 12: Importing mock data file
2. Line 22: State initialized with mock data
3. All operations are local (no API calls)

**Implementation Steps:**

**Step 1:** Remove mock import
```javascript
// REMOVE THIS LINE:
// import { mockNotifications, getNotificationsByFilter } from './data/mockNotifications';
```

**Step 2:** Import API hook
```javascript
import { useNotifications } from '../../utils/hooks/useAPI';
```

**Step 3:** Replace state with hook
```javascript
const { 
  notifications, 
  fetchNotifications, 
  markAsRead, 
  markAllAsRead,
  deleteNotification,
  loading,
  error 
} = useNotifications();

// Calculate stats from real data
const stats = {
  total: notifications?.length || 0,
  unread: notifications?.filter(n => !n.isRead).length || 0,
  // ... more stats
};
```

**Step 4:** Update handlers to use API
```javascript
const handleNotificationPress = async (notification) => {
  if (!notification.isRead) {
    await markAsRead(notification.id);
  }
};

const handleDeleteNotification = async (notificationId) => {
  await deleteNotification(notificationId);
};

const handleMarkAllAsRead = async () => {
  await markAllAsRead();
};
```

**Step 5:** Add refresh functionality
```javascript
const handleRefresh = async () => {
  await fetchNotifications();
};
```

---

## 🎯 Priority Order

### Phase 1: Critical User-Facing Pages (Week 1)
1. ✅ **EcoStats** - Already done
2. ✅ **Home** - Already done
3. ⏳ **Profile** - Needs integration (2 hours)
4. ⏳ **Trips** - Needs integration (3 hours)
5. ⏳ **Notifications** - Needs integration (2 hours)

### Phase 2: Supporting Screens (Week 2)
6. ⏳ **Planner** - Verify all APIs connected
7. ⏳ **Route Details** - Live delays integration
8. ⏳ **Live Screen** - Auto-refresh widgets
9. ⏳ **Profile Sub-screens** - Settings, preferences

### Phase 3: Polish & Optimization (Week 3)
10. ⏳ Error handling improvements
11. ⏳ Loading states optimization
12. ⏳ Offline support implementation
13. ⏳ Performance testing

---

## 📁 Files That Need Changes

### Frontend Files to Modify (3 Main Files)

1. **`pages/profile/ProfileScreen.js`**
   - Remove lines 15-37 (mock data)
   - Add API hooks
   - Calculate sustainability from trips

2. **`pages/trips/TripsScreen.js`**
   - Remove lines 11-77 (mock data)
   - Add useTrips() and useRoutes() hooks
   - Implement auto-save journey

3. **`pages/notifications/NotificationsScreen.js`**
   - Remove line 12 (mock import)
   - Remove mockNotifications usage
   - Add useNotifications() hook

### Backend Files (Already Complete ✅)

All required backend endpoints are already implemented:
- ✅ `/api/v1/user/profile`
- ✅ `/api/v1/user/preferences`
- ✅ `/api/v1/trips`
- ✅ `/api/v1/trips/stats`
- ✅ `/api/v1/notifications`
- ✅ `/api/v1/routes`

---

## 🧪 Testing Strategy

### Unit Tests (Per Hook)
```javascript
// Test useUser hook
describe('useUser', () => {
  it('should fetch user profile from API', async () => {
    // Mock API response
    // Render component
    // Assert data displays
  });
});
```

### Integration Tests (Per Page)
```javascript
// Test Profile screen
describe('ProfileScreen', () => {
  it('should load real user data from backend', async () => {
    // Start server
    // Navigate to profile
    // Wait for data to load
    // Verify user info displays
  });
});
```

### E2E Tests (Full Flow)
```javascript
// Test complete user journey
describe('User Journey', () => {
  it('should complete a trip and see it in Trips screen', async () => {
    // Plan journey
    // Complete trip
    // Navigate to Trips screen
    // Verify trip appears in list
  });
});
```

---

## 📊 Success Metrics

### Before Integration
```
❌ 3 pages using mock data
❌ No real user profile
❌ No trip history tracking
❌ No real-time notifications
```

### After Integration
```
✅ 100% pages connected to backend
✅ Real user profiles from API
✅ Live trip tracking
✅ Real-time notification feed
✅ Dynamic sustainability stats
```

---

## 🎯 Next Actions

### Immediate (Today):
1. ✅ Review this audit document
2. ⏳ Get approval to proceed
3. ⏳ Start with Profile screen integration

### This Week:
- [ ] Complete Profile screen
- [ ] Complete Trips screen
- [ ] Complete Notifications screen
- [ ] Test all integrations

### Next Week:
- [ ] Verify Planner screen APIs
- [ ] Integrate live delays in Route screen
- [ ] Add auto-refresh to Live screen
- [ ] Connect all profile sub-screens

---

## 🔧 Developer Notes

### Hook Pattern to Follow

All API hooks follow the same pattern:

```javascript
export const useEntity = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (params) => {
    try {
      setLoading(true);
      const response = await entityAPI.getEntity(params);
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, fetchData };
};
```

### Best Practices

1. **Always use hooks** - Never import mock data directly
2. **Handle loading states** - Show skeletons while loading
3. **Handle errors gracefully** - Show retry buttons
4. **Optimistic updates** - Update UI before API confirms
5. **Auto-refresh** - Poll important data periodically
6. **Cache wisely** - Use React Query caching strategies

---

## 🚨 Common Pitfalls to Avoid

### ❌ DON'T: Import mock data files
```javascript
// WRONG
import { mockNotifications } from './data/mockNotifications';
```

### ✅ DO: Use API hooks
```javascript
// CORRECT
import { useNotifications } from '../../utils/hooks/useAPI';
const { notifications } = useNotifications();
```

### ❌ DON'T: Hardcode user data
```javascript
// WRONG
const MOCK_USER = { name: 'Test User', email: 'test@example.com' };
```

### ✅ DO: Fetch from API
```javascript
// CORRECT
const { user } = useUser();
```

### ❌ DON'T: Fake loading states
```javascript
// WRONG
setTimeout(() => setLoading(false), 500);
```

### ✅ DO: Load real data
```javascript
// CORRECT
useEffect(() => {
  fetchUserData().then(() => setLoading(false));
}, []);
```

---

## 📈 Impact Assessment

### Code Quality Improvement
- **Before:** Mix of mock and real data (inconsistent)
- **After:** 100% real data throughout (consistent)

### User Experience Improvement
- **Before:** Static screens, no personalization
- **After:** Dynamic content, personalized experience

### Maintainability Improvement
- **Before:** Multiple data sources (confusing)
- **After:** Single source of truth (backend API)

---

**Ready to proceed with integration!** Which page should I start with?
