import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

let initialized = false;

export function initSentry() {
  if (initialized) return;
  const dsn = Constants.expoConfig?.extra?.SENTRY_DSN;
  if (!dsn) return;
  Sentry.init({
    dsn,
    tracesSampleRate: 0.2,
    environment: Constants.expoConfig?.extra?.SENTRY_ENV || 'production',
  });
  initialized = true;
}

export function isSentryEnabled() {
  return initialized;
}

export function captureException(error, extra) {
  if (initialized) {
    Sentry.captureException(error, extra);
  } else {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export function captureMessage(message, level = 'info') {
  if (initialized) {
    Sentry.captureMessage(message, level);
  }
}
