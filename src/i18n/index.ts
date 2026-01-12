import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import fr from './locales/fr.json';

// Get saved language from localStorage or detect from browser
const getDefaultLocale = (): string => {
  const saved = localStorage.getItem('droneops-locale');
  if (saved === 'en' || saved === 'fr') {
    return saved;
  }
  
  // Detect browser language
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'fr' ? 'fr' : 'en';
};

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    fr
  }
});

export default i18n;
