import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import IntroScreen from './pages/home/IntroScreen';
import HomeScreen from './pages/home/HomeScreen';
import PlannerScreen from './pages/planner/PlannerScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { View, ActivityIndicator } from 'react-native';
import LiveScreen from './pages/live/LiveScreen';
import ProfileScreen from './pages/profile/ProfileScreen';
import EcoStatsScreen from './pages/ecostats/EcoStatsScreen';

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
      <Tab.Screen name="Trips" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#185a9d" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Intro" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
