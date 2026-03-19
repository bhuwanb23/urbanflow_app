import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import es from './es';

/**
 * i18n Configuration
 * Initialize internationalization for the route module
 */

// Available languages
export const availableLanguages = ['en', 'es'];

// Default language
export const defaultLanguage = 'en';

// Initialize i18next
i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  fallbackLng: defaultLanguage,
  supportedLngs: availableLanguages,
  
  // Resources
  resources: {
    en: {
      translation: en,
    },
    es: {
      translation: es,
    },
  },

  // Interpolation
  interpolation: {
    escapeValue: false, // React already escapes
    prefix: '{',
    suffix: '}',
  },

  // React settings
  react: {
    useSuspense: false,
  },

  // Logging in development
  debug: __DEV__,
});

/**
 * Change language
 */
export const changeLanguage = async (lng) => {
  try {
    await i18next.changeLanguage(lng);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

/**
 * Get current language
 */
export const getCurrentLanguage = () => {
  return i18next.language || defaultLanguage;
};

/**
 * Get translation helper
 * Usage: t('route.title') instead of useTranslation hook
 */
export const t = (key, options = {}) => {
  return i18next.t(key, options);
};

export default i18next;
