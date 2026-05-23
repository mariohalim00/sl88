import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { id } from './locales/id';

const STORAGE_KEY = 'sl88-language';

const resources = {
  en: { translation: en },
  id: { translation: id },
} as const;

const getInitialLanguage = () => {
  if (typeof window === 'undefined') {
    return 'id';
  }

  const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
  if (storedLanguage === 'en' || storedLanguage === 'id') {
    return storedLanguage;
  }

  return 'id';
};

void i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  supportedLngs: ['en', 'id'],
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (language) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, language);
  document.documentElement.lang = language;
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language;
}

export { i18n };
