<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useI18nStore } from '../stores/i18n';

const { locale } = useI18n();
const i18nStore = useI18nStore();

const languages = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' }
];

const currentLanguage = computed(() => {
  return languages.find(lang => lang.code === locale.value) || languages[0];
});

const switchLanguage = (langCode: 'en' | 'fr') => {
  i18nStore.setLocale(langCode);
};
</script>

<template>
  <div class="language-switcher" v-if="currentLanguage">
    <div class="language-dropdown">
      <button class="language-button" type="button">
        <span class="language-flag">{{ currentLanguage.flag }}</span>
        <span class="language-label">{{ currentLanguage.label }}</span>
        <span class="material-symbols-outlined language-arrow">expand_more</span>
      </button>
      <div class="language-menu">
        <button
          v-for="lang in languages"
          :key="lang.code"
          @click="switchLanguage(lang.code as 'en' | 'fr')"
          :class="['language-option', { 'language-option-active': lang.code === locale.value }]"
          type="button"
        >
          <span class="language-option-flag">{{ lang.flag }}</span>
          <span class="language-option-label">{{ lang.label }}</span>
          <span v-if="lang.code === locale.value" class="material-symbols-outlined language-option-check">check</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.language-switcher {
  position: relative;
}

.language-dropdown {
  position: relative;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: transparent;
  border: 1px solid var(--color-slate-300);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--color-slate-900);
  font-size: 0.875rem;
  font-weight: 500;
}

.language-button:hover {
  background-color: var(--color-slate-50);
  border-color: var(--color-primary);
}

.dark .language-button {
  border-color: var(--color-dark-344d65);
  color: var(--color-white);
}

.dark .language-button:hover {
  background-color: var(--color-dark-1a2632);
}

.language-flag {
  font-size: 1rem;
}

.language-label {
  font-weight: 600;
}

.language-arrow {
  font-size: 1rem;
  transition: transform 0.3s;
}

.language-dropdown:hover .language-arrow {
  transform: rotate(180deg);
}

.language-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 120px;
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all 0.3s;
  z-index: 50;
}

.dark .language-menu {
  background-color: var(--color-dark-1a2632);
  border-color: var(--color-dark-243647);
}

.language-dropdown:hover .language-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.language-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
  color: var(--color-slate-900);
  font-size: 0.875rem;
}

.language-option:hover {
  background-color: var(--color-slate-50);
}

.dark .language-option {
  color: var(--color-white);
}

.dark .language-option:hover {
  background-color: var(--color-dark-243647);
}

.language-option-active {
  background-color: var(--color-primary-10);
  color: var(--color-primary);
  font-weight: 600;
}

.dark .language-option-active {
  background-color: var(--color-primary-20);
}

.language-option-flag {
  font-size: 1rem;
}

.language-option-label {
  flex: 1;
}

.language-option-check {
  font-size: 1rem;
  color: var(--color-primary);
}
</style>
