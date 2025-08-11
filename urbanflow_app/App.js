import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import IntroScreen from './pages/home/IntroScreen';
import LoginScreen from './pages/auth/LoginScreen';
import HomeScreen from './pages/home/HomeScreen';
import PlannerScreen from './pages/planner/PlannerScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts as useUrbanist, Urbanist_400Regular, Urbanist_700Bold } from '@expo-google-fonts/urbanist';
import { useFonts as usePoppins, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useFonts as useMontserrat, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { View, ActivityIndicator } from 'react-native';
import LiveScreen from './pages/live/LiveScreen';
import ProfileScreen from './pages/profile/ProfileScreen';
import EcoStatsScreen from './pages/ecostats/EcoStatsScreen';
import TripsScreen from './pages/trips/TripsScreen';
import { tokenManager } from './utils/auth';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Planner"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: { borderTopLeftRadius: 24, borderTopRightRadius: 24, height: 64, backgroundColor: '#fff' },
        tabBarLabelStyle: { fontFamily: 'Urbanist_700Bold', fontSize: 12 },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Planner') iconName = 'compass';
          else if (route.name === 'Live') iconName = 'traffic-light';
          else if (route.name === 'EcoStats') iconName = 'leaf';
          else if (route.name === 'Trips') iconName = 'map';
          else if (route.name === 'Profile') iconName = 'account-circle';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#185a9d',
        tabBarInactiveTintColor: '#b0bec5',
      })}
    >
      <Tab.Screen name="Planner" component={PlannerScreen} />
      <Tab.Screen name="Live" component={LiveScreen} />
      <Tab.Screen name="EcoStats" component={EcoStatsScreen} />
      <Tab.Screen name="Trips" component={TripsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#185a9d" />
      </View>
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
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName={isLoggedIn ? "MainTabs" : "Intro"} 
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
