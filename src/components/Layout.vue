<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from './LanguageSwitcher.vue';

const route = useRoute();
const { t } = useI18n();
</script>

<template>
  <div class="layout-container">
    <!-- Header -->
    <header class="header">
      <router-link to="/" class="logo-link">
        <div class="logo-icon">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
            <path clip-rule="evenodd" d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z" fill="currentColor" fill-rule="evenodd"></path>
          </svg>
        </div>
        <h2 class="logo-text">DroneOps</h2>
      </router-link>
      <div class="header-nav">
        <div class="nav-links">
          <router-link to="/" :class="['nav-link', { 'nav-link-active': route.name === 'home' }]">{{ t('layout.nav.services') }}</router-link>
          <router-link to="/" class="nav-link">{{ t('layout.nav.fleet') }}</router-link>
          <router-link to="/" class="nav-link">{{ t('layout.nav.work') }}</router-link>
          <router-link to="/contact" :class="['nav-link', { 'nav-link-active': route.name === 'contact' }]">{{ t('layout.nav.contact') }}</router-link>
        </div>
        <LanguageSwitcher />
        <router-link to="/booking" class="book-button">
          <span class="book-button-text">{{ t('common.bookPilot') }}</span>
        </router-link>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-col">
          <div class="footer-logo">
            <div class="footer-logo-icon">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
              </svg>
            </div>
            <span class="footer-logo-text">DroneOps</span>
          </div>
          <p class="footer-description">
            {{ t('layout.footer.description') }}
          </p>
        </div>
        <div class="footer-col">
          <h4 class="footer-heading">{{ t('layout.footer.company') }}</h4>
          <ul class="footer-list">
            <li><button class="footer-link">{{ t('layout.footer.aboutUs') }}</button></li>
            <li><button class="footer-link">{{ t('layout.footer.careers') }}</button></li>
            <li><button class="footer-link">{{ t('layout.footer.blog') }}</button></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 class="footer-heading">{{ t('layout.footer.services') }}</h4>
          <ul class="footer-list">
            <li><button class="footer-link">{{ t('layout.footer.realEstate') }}</button></li>
            <li><button class="footer-link">{{ t('layout.footer.events') }}</button></li>
            <li><button class="footer-link">{{ t('layout.footer.inspections') }}</button></li>
            <li><button class="footer-link">{{ t('layout.footer.mapping') }}</button></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 class="footer-heading">{{ t('layout.footer.legal') }}</h4>
          <ul class="footer-list">
            <li><button class="footer-link">{{ t('layout.footer.privacyPolicy') }}</button></li>
            <li><button class="footer-link">{{ t('layout.footer.termsOfService') }}</button></li>
            <li><button class="footer-link">{{ t('layout.footer.flightRegulations') }}</button></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>{{ t('layout.footer.copyright') }}</p>
        <div class="footer-social">
          <span class="material-symbols-outlined social-icon">thumb_up</span>
          <span class="material-symbols-outlined social-icon">share</span>
          <span class="material-symbols-outlined social-icon">mail</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import '../assets/variables.css';

.layout-container {
  position: relative;
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* Header */
.header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
  border-bottom: 1px solid var(--color-slate-200);
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  padding: 0.75rem 1.5rem;
}

@media (min-width: 1024px) {
  .header {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
}

@media (prefers-color-scheme: dark) {
  .header {
    border-bottom-color: var(--color-dark-border);
    background-color: rgba(17, 26, 34, 0.9);
  }
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  color: var(--color-primary);
}

.logo-text {
  color: var(--color-slate-900);
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.015em;
  margin: 0;
}

@media (prefers-color-scheme: dark) {
  .logo-text {
    color: var(--color-white);
  }
}

.header-nav {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
}

.nav-links {
  display: none;
  align-items: center;
  gap: 2.25rem;
}

@media (min-width: 768px) {
  .nav-links {
    display: flex;
  }
}

.nav-link {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
  color: var(--color-slate-900);
  text-decoration: none;
  transition: color var(--transition-base);
}

.nav-link:hover {
  color: var(--color-primary);
}

.nav-link-active {
  color: var(--color-primary);
}

@media (prefers-color-scheme: dark) {
  .nav-link {
    color: var(--color-white);
  }
}

.book-button {
  display: flex;
  min-width: 84px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: var(--radius-lg);
  height: 2.5rem;
  padding: 0 1rem;
  background-color: var(--color-primary);
  color: var(--color-white);
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 0.015em;
  text-decoration: none;
  transition: all var(--transition-base);
  box-shadow: 0 10px 15px -3px rgba(25, 127, 230, 0.2);
}

.book-button:hover {
  background-color: #1566c4;
}

.book-button-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-x: hidden;
}

/* Footer */
.footer {
  background-color: var(--color-white);
  border-top: 1px solid var(--color-slate-200);
  padding: 3rem 1rem;
}

@media (min-width: 768px) {
  .footer {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .footer {
    padding-left: 10rem;
    padding-right: 10rem;
  }
}

@media (prefers-color-scheme: dark) {
  .footer {
    background-color: var(--color-dark-bg);
    border-top-color: var(--color-dark-border);
  }
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}

@media (min-width: 768px) {
  .footer-content {
    grid-template-columns: repeat(4, 1fr);
  }
}

.footer-col {
  grid-column: span 1;
}

@media (min-width: 768px) {
  .footer-col {
    grid-column: span 1;
  }
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.footer-logo-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-primary);
}

.footer-logo-text {
  color: var(--color-slate-900);
  font-weight: 700;
  font-size: 1.125rem;
}

@media (prefers-color-scheme: dark) {
  .footer-logo-text {
    color: var(--color-white);
  }
}

.footer-description {
  color: var(--color-slate-500);
  font-size: 0.875rem;
}

@media (prefers-color-scheme: dark) {
  .footer-description {
    color: var(--color-slate-400);
  }
}

.footer-heading {
  color: var(--color-slate-900);
  font-weight: 700;
  margin-bottom: 1rem;
}

@media (prefers-color-scheme: dark) {
  .footer-heading {
    color: var(--color-white);
  }
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-slate-500);
}

@media (prefers-color-scheme: dark) {
  .footer-list {
    color: var(--color-slate-400);
  }
}

.footer-link {
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  font-size: inherit;
  cursor: pointer;
  transition: color var(--transition-base);
}

.footer-link:hover {
  color: var(--color-primary);
}

.footer-bottom {
  max-width: 1200px;
  margin: 3rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid var(--color-slate-200);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--color-slate-500);
}

@media (min-width: 768px) {
  .footer-bottom {
    flex-direction: row;
  }
}

@media (prefers-color-scheme: dark) {
  .footer-bottom {
    border-top-color: var(--color-dark-border);
    color: var(--color-slate-400);
  }
}

.footer-social {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .footer-social {
    margin-top: 0;
  }
}

.social-icon {
  cursor: pointer;
  transition: color var(--transition-base);
}

.social-icon:hover {
  color: var(--color-white);
}
</style>
