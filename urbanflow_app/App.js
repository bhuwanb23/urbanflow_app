import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import IntroScreen from './pages/home/IntroScreen';
import LoginScreen from './pages/auth/LoginScreen';
import HomeScreen from './pages/home/HomeScreen';
import PlannerScreen from './pages/planner/PlannerScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts as useUrbanist, Urbanist_400Regular, Urbanist_700Bold } from '@expo-google-fonts/urbanist';
import { useFonts as usePoppins, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useFonts as useMontserrat, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { View, ActivityIndicator, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LiveScreen from './pages/live/LiveScreen';
import ProfileScreen from './pages/profile/ProfileScreen';
import EcoStatsScreen from './pages/ecostats/EcoStatsScreen';
import TripsScreen from './pages/trips/TripsScreen';
import NotificationsScreen from './pages/notifications/NotificationsScreen';
import RouteDetailsScreen from './pages/route/RouteDetailsScreen';
import { tokenManager } from './utils/auth';



// Import Profile Screens
import LanguageRegionScreen from './pages/profile/screens/LanguageRegionScreen';
import PreferredTransportScreen from './pages/profile/screens/PreferredTransportScreen';
import ProfileNotificationsScreen from './pages/profile/screens/NotificationsScreen';
import MobilityGoalsScreen from './pages/profile/screens/MobilityGoalsScreen';
import PrivacyScreen from './pages/profile/screens/PrivacyScreen';
import EditProfileScreen from './pages/profile/screens/EditProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();

// Screen wrapper to add bottom padding for tab bar
const ScreenWrapper = ({ children }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ 
      flex: 1, 
      paddingBottom: 60 + insets.bottom,
      backgroundColor: '#fff'
    }}>
      {children}
    </View>
  );
};

// Profile Stack Navigator
function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="LanguageRegionScreen" component={LanguageRegionScreen} />
      <ProfileStack.Screen name="PreferredTransportScreen" component={PreferredTransportScreen} />
      <ProfileStack.Screen name="ProfileNotificationsScreen" component={ProfileNotificationsScreen} />
      <ProfileStack.Screen name="MobilityGoalsScreen" component={MobilityGoalsScreen} />
      <ProfileStack.Screen name="PrivacyScreen" component={PrivacyScreen} />
      <ProfileStack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      initialRouteName="Planner"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: { 
          height: 60 + insets.bottom,
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          paddingHorizontal: 16,
        },
        tabBarLabelStyle: { 
          fontFamily: 'Urbanist_700Bold', 
          fontSize: 11,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Planner') iconName = 'compass';
          else if (route.name === 'Live') iconName = 'traffic-light';
          else if (route.name === 'EcoStats') iconName = 'leaf';
          else if (route.name === 'Trips') iconName = 'map';
          else if (route.name === 'Profile') iconName = 'account-circle';
          
          return (
            <Icon 
              name={iconName} 
              size={focused ? 24 : 22} 
              color={focused ? '#6366f1' : '#9ca3af'} 
            />
          );
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
      })}
    >
      <Tab.Screen 
        name="Planner" 
        component={(props) => (
          <ScreenWrapper>
            <PlannerScreen {...props} />
          </ScreenWrapper>
        )} 
      />
      <Tab.Screen 
        name="Live" 
        component={(props) => (
          <ScreenWrapper>
            <LiveScreen {...props} />
          </ScreenWrapper>
        )} 
      />
      <Tab.Screen 
        name="EcoStats" 
        component={(props) => (
          <ScreenWrapper>
            <EcoStatsScreen {...props} />
          </ScreenWrapper>
        )} 
      />
      <Tab.Screen 
        name="Trips" 
        component={(props) => (
          <ScreenWrapper>
            <TripsScreen {...props} />
          </ScreenWrapper>
        )} 
      />
      <Tab.Screen 
        name="Profile" 
        component={(props) => (
          <ScreenWrapper>
            <ProfileStackNavigator {...props} />
          </ScreenWrapper>
        )} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  let [urbanistLoaded] = useUrbanist({
    Urbanist_400Regular,
    Urbanist_700Bold,
  });
  let [poppinsLoaded] = usePoppins({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  let [montserratLoaded] = useMontserrat({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const fontsLoaded = urbanistLoaded && poppinsLoaded && montserratLoaded;

  // Check authentication status on app start
  React.useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const loggedIn = await tokenManager.isLoggedIn();
      setIsLoggedIn(loggedIn);
    } catch (error) {
      console.log('Error checking auth status:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
          <ActivityIndicator size="large" color="#185a9d" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#185a9d',
      secondary: '#43cea2',
    },
    fonts: {
      ...DefaultTheme.fonts,
      displayLarge: { fontFamily: 'Poppins_700Bold', fontWeight: '700' },
      displayMedium: { fontFamily: 'Poppins_700Bold', fontWeight: '700' },
      displaySmall: { fontFamily: 'Poppins_700Bold', fontWeight: '700' },
      headlineLarge: { fontFamily: 'Poppins_700Bold', fontWeight: '700' },
      headlineMedium: { fontFamily: 'Poppins_700Bold', fontWeight: '700' },
      headlineSmall: { fontFamily: 'Poppins_700Bold', fontWeight: '700' },
      titleLarge: { fontFamily: 'Poppins_700Bold', fontWeight: '700' },
      titleMedium: { fontFamily: 'Poppins_700Bold', fontWeight: '700' },
      titleSmall: { fontFamily: 'Poppins_700Bold', fontWeight: '700' },
      labelLarge: { fontFamily: 'Urbanist_400Regular', fontWeight: '400' },
      labelMedium: { fontFamily: 'Urbanist_400Regular', fontWeight: '400' },
      labelSmall: { fontFamily: 'Urbanist_400Regular', fontWeight: '400' },
      bodyLarge: { fontFamily: 'Urbanist_400Regular', fontWeight: '400' },
      bodyMedium: { fontFamily: 'Urbanist_400Regular', fontWeight: '400' },
      bodySmall: { fontFamily: 'Urbanist_400Regular', fontWeight: '400' },
    },
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
            <Stack.Navigator 
              initialRouteName={isLoggedIn ? "MainTabs" : "Intro"} 
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Intro" component={IntroScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
              <Stack.Screen name="RouteDetailsScreen" component={RouteDetailsScreen} />
            </Stack.Navigator>
          </SafeAreaView>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
