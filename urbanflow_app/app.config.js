export default {
  expo: {
    name: 'UrbanFlow',
    slug: 'urbanflow_app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      bundleIdentifier: 'com.urbanflow.app',
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      package: 'com.urbanflow.app',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-font',
      'expo-haptics',
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission: 'Allow UrbanFlow to use your location for live route tracking.',
        },
      ],
      [
        'expo-notifications',
        {
          color: '#16a34a',
        },
      ],
    ],
    extra: {
      eas: {
        projectId: 'd1f97f39-5370-4ab6-91ba-adf5a74e7bc4',
      },
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
    },
  },
};
