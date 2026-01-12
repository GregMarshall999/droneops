import { defineStore } from 'pinia';
import i18n from '../i18n';

export const useI18nStore = defineStore('i18n', {
  state: () => ({
    locale: (localStorage.getItem('droneops-locale') || i18n.global.locale.value) as 'en' | 'fr'
  }),

  actions: {
    setLocale(locale: 'en' | 'fr') {
      this.locale = locale;
      localStorage.setItem('droneops-locale', locale);
      
      // Update vue-i18n locale
      i18n.global.locale.value = locale;
    }
  }
});
