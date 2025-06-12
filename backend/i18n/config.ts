import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translations
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enClients from './locales/en/clients.json';
import enTasks from './locales/en/tasks.json';

import esCommon from './locales/es/common.json';
import esAuth from './locales/es/auth.json';
import esClients from './locales/es/clients.json';
import esTasks from './locales/es/tasks.json';

import frCommon from './locales/fr/common.json';
import frAuth from './locales/fr/auth.json';
import frClients from './locales/fr/clients.json';
import frTasks from './locales/fr/tasks.json';

import deCommon from './locales/de/common.json';
import deAuth from './locales/de/auth.json';
import deClients from './locales/de/clients.json';
import deTasks from './locales/de/tasks.json';

import ptCommon from './locales/pt/common.json';
import ptAuth from './locales/pt/auth.json';
import ptClients from './locales/pt/clients.json';
import ptTasks from './locales/pt/tasks.json';

// Language resources
const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    clients: enClients,
    tasks: enTasks,
  },
  es: {
    common: esCommon,
    auth: esAuth,
    clients: esClients,
    tasks: esTasks,
  },
  fr: {
    common: frCommon,
    auth: frAuth,
    clients: frClients,
    tasks: frTasks,
  },
  de: {
    common: deCommon,
    auth: deAuth,
    clients: deClients,
    tasks: deTasks,
  },
  pt: {
    common: ptCommon,
    auth: ptAuth,
    clients: ptClients,
    tasks: ptTasks,
  },
};

// i18n configuration
i18n
  // Load translation using http -> see /public/locales
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false, // Disable suspense for better UX
    },
  });

// Export i18n instance
export default i18n;

// Export supported languages
export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'pt', name: 'Português' },
] as const;

// Export language type
export type Language = typeof supportedLanguages[number]['code']; 