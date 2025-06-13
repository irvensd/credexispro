import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import English translations
import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enClients from "./locales/en/clients.json";
import enTasks from "./locales/en/tasks.json";

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    clients: enClients,
    tasks: enTasks,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'common',
    ns: ['common', 'auth', 'clients', 'tasks'],
  });

export default i18n; 