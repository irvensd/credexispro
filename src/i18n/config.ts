import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enClients from './locales/en/clients.json';
import enTasks from './locales/en/tasks.json';

// Language resources
const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    clients: enClients,
    tasks: enTasks,
  },
};

// i18n configuration
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Set English as the only language
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable suspense for better UX
    },
  });

// Export i18n instance
export default i18n; 