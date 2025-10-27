import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import translationEN from './translations/en.json';
import translationLT from './translations/lt.json';
import moment from 'moment';
import 'moment/locale/lt';

moment.locale('en');

i18n
  .use(detector)
  .use(backend)
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem('i18nextLng') || 'en',
    fallbackLng: localStorage.getItem('i18nextLng') || 'en',
    nsSeparator: false,
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    resources: {
      en: {
        translation: translationEN
      },
      lt: {
        translation: translationLT
      }
    },
    detection: {
      // order and from where user language should be detected
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path'],

      // keys or params to lookup language from
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,

      // cache user language on
      //caches: ['localStorage', 'cookie'],
      excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
      htmlTag: document.documentElement,
    },
    react: {
      wait: true,
      useSuspense: false,
    },
  });