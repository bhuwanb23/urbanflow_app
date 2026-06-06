import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import es from './es';

/**
 * App-wide i18n configuration.
 * Initialized at module load so that consumers can call
 * `t('key')` synchronously from any screen.
 */

export const availableLanguages = ['en', 'es'];
export const defaultLanguage = 'en';

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    fallbackLng: defaultLanguage,
    supportedLngs: availableLanguages,
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    interpolation: {
      escapeValue: false,
      prefix: '{',
      suffix: '}',
    },
    react: {
      useSuspense: false,
    },
    debug: false,
  });
}

export const changeLanguage = async (lng) => {
  try {
    await i18next.changeLanguage(lng);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

export const getCurrentLanguage = () => i18next.language || defaultLanguage;

export const t = (key, options = {}) => i18next.t(key, options);

export default i18next;
