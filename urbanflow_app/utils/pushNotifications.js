import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { userAPI } from './api';
import { captureException } from './monitoring';

// Show alerts/badges for incoming notifications while app is foregrounded.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Register for push permissions and send the Expo push token to the backend.
// Returns the token, or null if unavailable (e.g. simulator, denied, offline).
export async function registerForPushNotifications() {
  try {
    if (!Device.isDevice) {
      // Push notifications require a physical device.
      return null;
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return null;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const tokenResult = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    const token = tokenResult?.data;

    if (token) {
      try {
        await userAPI.savePushToken(token);
      } catch (err) {
        captureException(err);
      }
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3CB371',
      });
    }

    return token;
  } catch (error) {
    captureException(error);
    return null;
  }
}

// Wire notification listeners. On tap, navigate to the notifications screen.
// Returns a cleanup function.
export function registerNotificationListeners(navigationRef) {
  const onReceived = () => {
    // Foreground notifications are shown via the handler above.
  };

  const onResponse = () => {
    const nav = navigationRef?.current;
    if (nav && typeof nav.navigate === 'function') {
      try {
        nav.navigate('NotificationsScreen');
      } catch (err) {
        captureException(err);
      }
    }
  };

  const receivedSub = Notifications.addNotificationReceivedListener(onReceived);
  const responseSub = Notifications.addNotificationResponseReceivedListener(onResponse);

  return () => {
    receivedSub.remove();
    responseSub.remove();
  };
}
