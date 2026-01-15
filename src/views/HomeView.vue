<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SERVICES, FLEET, VERSION } from '../constants';

const router = useRouter();
const { t } = useI18n();

// Carousel state - find Avata 2 index and center it
const avata2Index = FLEET.findIndex(drone => drone.id === 'avata-2');
// Start with Avata 2 centered (index 0), so we show items 0, 1, 2
const currentCarouselIndex = ref(0);

const maxCarouselIndex = FLEET.length - 3;

const goToPrevious = () => {
  if (currentCarouselIndex.value === 0) {
    // Loop to the end
    currentCarouselIndex.value = maxCarouselIndex;
  } else {
    currentCarouselIndex.value--;
  }
};

const goToNext = () => {
  if (currentCarouselIndex.value >= maxCarouselIndex) {
    // Loop to the beginning
    currentCarouselIndex.value = 0;
  } else {
    currentCarouselIndex.value++;
  }
};

// Calculate transform to center the current index
const carouselTransform = computed(() => {
  if (currentCarouselIndex.value === 0) {
    return 'translateX(0)';
  }
  // Shift by currentCarouselIndex items
  // Each item wrapper is calc((100% - 4rem) / 3) wide
  // Plus 2rem gap after each item (except the last)
  // Simplified: use percentage for item width and rem for gap
  const itemWidthPercent = 100 / 3;
  const gapRem = 2;
  return `translateX(calc(-${currentCarouselIndex.value} * ${itemWidthPercent}% - ${currentCarouselIndex.value * gapRem}rem))`;
});

const stats = computed(() => [
  { icon: 'flight', label: t('home.stats.hoursFlown'), value: '50+' },
  //{ icon: 'assignment_turned_in', label: t('home.stats.projects'), value: '950+' },
  { icon: 'shield', label: t('home.stats.safetyRating'), value: '100%' },
  { icon: 'public', label: t('home.stats.countries'), value: '2' }
]);

const getStatLabel = (label: string) => {
  const labelMap: Record<string, string> = {
    'Flight Time': 'booking.stats.flightTime',
    'Resolution': 'booking.stats.resolution',
    'Speed': 'booking.stats.speed',
    'Agility': 'booking.stats.agility',
    'Payload': 'booking.stats.payload'
  };
  return t(labelMap[label] || label);
};

const navigateToBooking = () => {
  router.push({ name: 'booking' });
};

const navigateToContact = () => {
  router.push({ name: 'contact' });
};

const getServiceKey = (id: string) => {
  const keyMap: Record<string, string> = {
    'events': 'events',
    'real-estate': 'realEstate',
    '3d-scans': '3dScans',
    'fpv': 'fpv',
    'social': 'social'
  };
  return keyMap[id] || id;
};

const getDroneKey = (id: string) => {
  const keyMap: Record<string, string> = {
    'avata-2': 'avata2',
    'mavic': 'mavic',
    'neo': 'neo',
    'fpv': 'fpv',
    'inspire': 'inspire'
  };
  return keyMap[id] || id;
};
</script>

<template>
  <div class="home-view animate-in fade-in">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content-wrapper">
          <div class="hero-card">
            <div 
              class="hero-background" 
              :style="{ 
                backgroundImage: `linear-gradient(rgba(17, 25, 33, 0.4) 0%, rgba(17, 25, 33, 0.9) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDNdc3ICjXIuZ_gSh5Kn5Qga8N-S9huscNY0KGS3r-8mA1raMKnQ8L27zXZkuXfMQMAb6ryCqgaLih3l7k_qvD7xsZPpCXa7DeYHKbSSDqFrn9o0GXolMJYJEdIgYLVBCWQ7Dj7UkgZNuuunrDGsUhke154HTPpuQBzf4jjHEgFL9lEuLB5VJQOA-BpZ_rS_4adF86ylNYSFsi2BjcGN3sybjkLxsgDr_ASBTrjO_lLyCyO3N59PCbdB9yS03R2w17l8vno4YFioAMx')` 
              }"
            ></div>
            <div class="hero-content">
              <span class="hero-badge">
                {{ t('home.hero.badge') }}
              </span>
              <h1 class="hero-title">
                {{ t('home.hero.title') }}
              </h1>
              <p class="hero-description">
                {{ t('home.hero.description') }}
              </p>
              <div class="hero-buttons">
                <button @click="navigateToBooking" class="hero-button-primary">
                  {{ t('common.bookPilot') }}
                </button>
                <button class="hero-button-secondary">
                  <span class="material-symbols-outlined hero-button-icon">play_circle</span>
                  {{ t('common.watchReel') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stats-grid">
          <div v-for="(stat, idx) in stats" :key="idx" class="stat-item">
            <div class="stat-header">
              <span class="material-symbols-outlined stat-icon">{{ stat.icon }}</span>
              <p class="stat-label">{{ stat.label }}</p>
            </div>
            <p class="stat-value">{{ stat.value }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="services-section" id="services">
      <div class="services-container">
        <div class="services-wrapper">
          <div class="services-header">
            <div class="services-header-content">
              <span class="services-badge">{{ t('home.services.badge') }}</span>
              <h2 class="services-title">
                {{ t('home.services.title') }}
              </h2>
              <p class="services-description">
                {{ t('home.services.description') }}
              </p>
            </div>
            <button v-if="VERSION.hasContent" class="services-view-all">
              {{ t('home.services.viewAllServices') }} <span class="material-symbols-outlined services-arrow">arrow_forward</span>
            </button>
          </div>
          
          <div class="services-grid">
            <div v-for="service in SERVICES" :key="service.id" class="service-card">
              <div class="service-image-wrapper">
                <div 
                  class="service-image" 
                  :style="{ backgroundImage: `url('${service.imageUrl}')` }"
                ></div>
              </div>
              <div class="service-content">
                <div class="service-header">
                  <div class="service-icon-wrapper">
                    <span class="material-symbols-outlined service-icon">{{ service.icon }}</span>
                  </div>
                  <h3 class="service-title">{{ t(`services.${getServiceKey(service.id)}.title`) }}</h3>
                </div>
                <p class="service-description">
                  {{ t(`services.${getServiceKey(service.id)}.description`) }}
                </p>
                <button v-if="VERSION.hasContent" class="service-link">
                  {{ t('common.learnMore') }} <span class="material-symbols-outlined service-link-icon">arrow_forward</span>
                </button>
              </div>
            </div>
              
            <!-- Custom Project Card -->
            <div class="custom-project-card">
              <div class="custom-project-icon-wrapper">
                <span class="material-symbols-outlined custom-project-icon">add</span>
              </div>
              <h3 class="custom-project-title">{{ t('home.services.customProject.title') }}</h3>
              <p class="custom-project-description">
                {{ t('home.services.customProject.description') }}
              </p>
              <button @click="navigateToContact" class="custom-project-button">
                {{ t('common.contactUs') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Fleet Section -->
    <section class="fleet-section" id="fleet">
      <div class="fleet-container">
        <div class="fleet-wrapper">
          <div class="fleet-header">
            <h2 class="fleet-title">{{ t('home.fleet.title') }}</h2>
            <div class="fleet-controls">
              <button 
                @click="goToPrevious" 
                class="fleet-control-button"
              >
                <span class="material-symbols-outlined">arrow_back</span>
              </button>
              <button 
                @click="goToNext" 
                class="fleet-control-button"
              >
                <span class="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
          
          <div class="fleet-carousel-wrapper">
            <div 
              class="fleet-carousel" 
              :style="{ transform: carouselTransform }"
            >
              <div v-for="drone in FLEET" :key="drone.id" class="drone-card-wrapper">
                <div class="drone-card">
                  <div class="drone-image-wrapper">
                    <img 
                      :alt="drone.name" 
                      class="drone-image" 
                      :src="drone.imageUrl" 
                    />
                    <div class="drone-image-overlay"></div>
                    <div v-if="drone.availableSoon" class="drone-available-soon">
                      {{ t('fleet.availableSoon') }}
                    </div>
                  </div>
                  <div class="drone-content">
                    <div class="drone-header">
                      <h3 class="drone-name">{{ t(`fleet.${getDroneKey(drone.id)}.name`) }}</h3>
                      <span class="drone-category">{{ t(`fleet.${getDroneKey(drone.id)}.category`) }}</span>
                    </div>
                    <p class="drone-description">
                      {{ t(`fleet.${getDroneKey(drone.id)}.description`) }}
                    </p>
                    <div class="drone-stats">
                      <div v-for="(stat, sIdx) in drone.stats" :key="sIdx" class="drone-stat">
                        <div class="drone-stat-header">
                          <span class="drone-stat-label">{{ getStatLabel(stat.label) }}</span>
                          <span class="drone-stat-value">{{ stat.value }}</span>
                        </div>
                        <div class="drone-stat-bar">
                          <div class="drone-stat-bar-fill" :style="{ width: `${stat.percentage}%` }"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-card">
        <div 
          class="cta-background" 
          :style="{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBkgzl3uIauXoBkmGxdHer8zA_CB_Or6-SoBt3dgI0QRCKImeUHXwITNl7v6bFY49gi_cF68n-921rZPEr-Nb3OAQwEKRtLyNshyvzh2KUhXAGyKsk2krtWfcI0ih22xclY7kuhNWHD5L7WWHUJ0JU0C3f5Uk9Q51W5N5DGOxLOGludReUrLNA3PyRjmJFRSUSmgwLR1WsZlQY7MUDFQQW6dsr9SXW6HYCu2m-sJU8k6mFqD7uhXbjBre9z705dUhlo2vVF2cE45xtX')` }"
        ></div>
        <div class="cta-gradient"></div>
        <div class="cta-content">
          <div class="cta-text">
            <h2 class="cta-title">{{ t('home.cta.title') }}</h2>
            <p class="cta-description">
              {{ t('home.cta.description') }}
            </p>
            <div class="cta-buttons">
              <button @click="navigateToBooking" class="cta-button-primary">
                {{ t('common.getQuote') }}
              </button>
              <button @click="navigateToContact" class="cta-button-secondary">
                {{ t('common.contactSales') }}
              </button>
            </div>
          </div>
          
          <div class="cta-visual">
            <div class="cta-circle-outer">
              <div class="cta-circle-inner">
                <span class="material-symbols-outlined cta-icon">near_me</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@import '../assets/variables.css';

.home-view {
  animation-duration: 0.7s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
}

/* Hero Section */
.hero-section {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: var(--color-background-dark);
}

.hero-container {
  padding: 1.25rem 1rem;
  display: flex;
  flex: 1;
  justify-content: center;
}

@media (min-width: 768px) {
  .hero-container {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .hero-container {
    padding: 4rem 10rem;
  }
}

.hero-content-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  flex: 1;
}

.hero-card {
  position: relative;
  display: flex;
  min-height: 560px;
  flex-direction: column;
  gap: 1.5rem;
  overflow: hidden;
  border-radius: var(--radius-2xl);
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 1s;
  transform: scale(1.05);
}

.hero-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 850px;
  align-items: center;
}

.hero-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background-color: rgba(25, 127, 230, 0.2);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid rgba(25, 127, 230, 0.3);
  backdrop-filter: blur(4px);
  margin-bottom: 1rem;
}

.hero-title {
  color: var(--color-white);
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: -0.033em;
  text-transform: uppercase;
  filter: drop-shadow(0 25px 50px -12px rgba(0, 0, 0, 0.25));
  margin: 0;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 3.75rem;
  }
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 4.5rem;
  }
}

.hero-description {
  color: rgb(226, 232, 240);
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.75;
  max-width: 42rem;
  margin: 0 auto;
  filter: drop-shadow(0 4px 6px -1px rgba(0, 0, 0, 0.1));
}

@media (min-width: 768px) {
  .hero-description {
    font-size: 1.25rem;
  }
}

.hero-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

@media (min-width: 640px) {
  .hero-buttons {
    flex-direction: row;
  }
}

.hero-button-primary {
  display: flex;
  min-width: 180px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  height: 3.5rem;
  padding: 0 2rem;
  background-color: var(--color-primary);
  color: var(--color-white);
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 0.015em;
  border: none;
  transition: all var(--transition-base);
  box-shadow: 0 20px 25px -5px rgba(25, 127, 230, 0.3);
}

.hero-button-primary:hover {
  background-color: #1566c4;
  transform: scale(1.05);
}

.hero-button-secondary {
  display: flex;
  min-width: 180px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  height: 3.5rem;
  padding: 0 2rem;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--color-white);
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 0.015em;
  transition: all var(--transition-base);
}

.hero-button-secondary:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.hero-button-icon {
  margin-right: 0.5rem;
  font-size: 1.25rem;
}

/* Stats Section */
.stats-section {
  width: 100%;
  background-color: var(--color-white);
  border-top: 1px solid var(--color-slate-200);
  border-bottom: 1px solid var(--color-slate-200);
}

@media (prefers-color-scheme: dark) {
  .stats-section {
    background-color: var(--color-dark-surface);
    border-top-color: var(--color-dark-border);
    border-bottom-color: var(--color-dark-border);
  }
}

.stats-container {
  padding: 3rem 1rem;
  display: flex;
  justify-content: center;
}

@media (min-width: 768px) {
  .stats-container {
    padding-left: 10rem;
    padding-right: 10rem;
  }
}

.stats-grid {
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

@media (min-width: 768px) {
  .stats-grid {
    justify-content: center;
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
  cursor: default;
  min-width: 150px;
}

@media (min-width: 768px) {
  .stat-item {
    align-items: flex-start;
    min-width: 200px;
  }
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary);
  margin-bottom: 0.25rem;
  transition: transform var(--transition-base);
}

.stat-item:hover .stat-header {
  transform: scale(1.1);
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-label {
  color: var(--color-slate-500);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}

@media (prefers-color-scheme: dark) {
  .stat-label {
    color: var(--color-slate-400);
  }
}

.stat-value {
  color: var(--color-slate-900);
  letter-spacing: -0.025em;
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0;
}

@media (min-width: 768px) {
  .stat-value {
    font-size: 2.25rem;
  }
}

@media (prefers-color-scheme: dark) {
  .stat-value {
    color: var(--color-white);
  }
}

/* Services Section */
.services-section {
  width: 100%;
  background-color: var(--color-slate-50);
  padding: 6rem 0;
}

@media (prefers-color-scheme: dark) {
  .services-section {
    background-color: var(--color-dark-bg);
  }
}

.services-container {
  padding: 0 1rem;
  display: flex;
  flex: 1;
  justify-content: center;
}

@media (min-width: 768px) {
  .services-container {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .services-container {
    padding-left: 10rem;
    padding-right: 10rem;
  }
}

.services-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  flex: 1;
}

.services-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 4rem;
  padding: 0 1rem;
}

@media (min-width: 768px) {
  .services-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
}

.services-header-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 700px;
}

.services-badge {
  color: var(--color-primary);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.875rem;
}

.services-title {
  color: var(--color-slate-900);
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.025em;
  margin: 0;
}

@media (min-width: 768px) {
  .services-title {
    font-size: 3rem;
  }
}

@media (prefers-color-scheme: dark) {
  .services-title {
    color: var(--color-white);
  }
}

.services-description {
  color: var(--color-slate-600);
  font-size: 1.125rem;
  line-height: 1.75;
}

@media (prefers-color-scheme: dark) {
  .services-description {
    color: var(--color-slate-400);
  }
}

.services-view-all {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary);
  font-weight: 700;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform var(--transition-base);
}

.services-view-all:hover {
  transform: translateX(0.25rem);
}

.services-arrow {
  font-size: 0.875rem;
  transition: all var(--transition-base);
}

.services-view-all:hover .services-arrow {
  margin-left: 0.25rem;
}

.services-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 0 1rem;
}

@media (min-width: 768px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.service-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-2xl);
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  transition: all 0.5s;
  display: flex;
  flex-direction: column;
}

.service-card:hover {
  border-color: rgba(25, 127, 230, 0.5);
  box-shadow: 0 25px 50px -12px rgba(25, 127, 230, 0.05);
}

@media (prefers-color-scheme: dark) {
  .service-card {
    background-color: var(--color-dark-surface-alt);
    border-color: var(--color-dark-border);
  }
}

.service-image-wrapper {
  aspect-ratio: 16 / 10;
  width: 100%;
  overflow: hidden;
}

.service-image {
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.7s;
}

.service-card:hover .service-image {
  transform: scale(1.1);
}

.service-content {
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.service-header {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.service-icon-wrapper {
  display: flex;
  height: 2.5rem;
  width: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  background-color: rgba(25, 127, 230, 0.1);
  color: var(--color-primary);
  transition: all var(--transition-base);
}

.service-card:hover .service-icon-wrapper {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.service-icon {
  font-size: 1.25rem;
}

.service-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-slate-900);
  margin: 0;
}

@media (prefers-color-scheme: dark) {
  .service-title {
    color: var(--color-white);
  }
}

.service-description {
  color: var(--color-slate-600);
  font-size: 0.875rem;
  line-height: 1.75;
  margin-bottom: 1.5rem;
}

@media (prefers-color-scheme: dark) {
  .service-description {
    color: var(--color-text-secondary);
  }
}

.service-link {
  margin-top: auto;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.service-link-icon {
  font-size: 0.75rem;
  transition: transform var(--transition-base);
}

.service-link:hover .service-link-icon {
  transform: translateX(0.25rem);
}

.custom-project-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-2xl);
  background-color: var(--color-primary);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2.5rem;
  transition: all 0.5s;
  box-shadow: 0 20px 25px -5px rgba(25, 127, 230, 0.2);
}

.custom-project-card:hover {
  transform: scale(1.02);
}

.custom-project-icon-wrapper {
  display: flex;
  height: 5rem;
  width: 5rem;
  margin-bottom: 1.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.2);
  color: var(--color-white);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform var(--transition-base);
}

.custom-project-card:hover .custom-project-icon-wrapper {
  transform: scale(1.1);
}

.custom-project-icon {
  font-size: 2.25rem;
  font-weight: 300;
}

.custom-project-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: 0.75rem;
  margin-top: 0;
}

.custom-project-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  margin-bottom: 2rem;
  max-width: 220px;
}

.custom-project-button {
  background-color: var(--color-white);
  color: var(--color-primary);
  padding: 0.75rem 2rem;
  border-radius: var(--radius-xl);
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-base);
  box-shadow: var(--shadow-lg);
}

.custom-project-button:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

/* Fleet Section */
.fleet-section {
  width: 100%;
  background-color: var(--color-white);
  padding: 6rem 0;
  border-top: 1px solid var(--color-slate-200);
}

@media (prefers-color-scheme: dark) {
  .fleet-section {
    background-color: var(--color-dark-surface);
    border-top-color: var(--color-dark-border);
  }
}

.fleet-container {
  padding: 0 1rem;
  display: flex;
  justify-content: center;
}

@media (min-width: 768px) {
  .fleet-container {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .fleet-container {
    padding-left: 10rem;
    padding-right: 10rem;
  }
}

.fleet-wrapper {
  max-width: 1200px;
  width: 100%;
}

.fleet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding: 0 1rem;
}

.fleet-title {
  color: var(--color-slate-900);
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  margin: 0;
}

@media (prefers-color-scheme: dark) {
  .fleet-title {
    color: var(--color-white);
  }
}

.fleet-controls {
  display: flex;
  gap: 0.75rem;
}

.fleet-control-button {
  height: 3rem;
  width: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid var(--color-slate-300);
  background: none;
  color: var(--color-slate-600);
  cursor: pointer;
  transition: all var(--transition-base);
}

.fleet-control-button:hover {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}

@media (prefers-color-scheme: dark) {
  .fleet-control-button {
    border-color: var(--color-dark-border-alt);
    color: var(--color-white);
  }
  
  .fleet-control-button-disabled:hover {
    color: var(--color-white);
    border-color: var(--color-dark-border-alt);
  }
}

.fleet-carousel-wrapper {
  overflow: hidden;
  padding: 0 1rem;
  position: relative;
}

.fleet-carousel {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  gap: 2rem;
  will-change: transform;
}

.drone-card-wrapper {
  flex: 0 0 calc((100% - 4rem) / 3);
  min-width: 0;
  padding: 0;
}

@media (max-width: 1023px) {
  .drone-card-wrapper {
    flex: 0 0 100%;
  }
  
  .fleet-carousel {
    gap: 1rem;
  }
}

.drone-card {
  background-color: var(--color-slate-50);
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-slate-200);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
}

.drone-card:hover {
  border-color: rgba(25, 127, 230, 0.4);
  box-shadow: var(--shadow-xl);
}

@media (prefers-color-scheme: dark) {
  .drone-card {
    background-color: var(--color-dark-surface-alt);
    border-color: var(--color-dark-border);
  }
}

.drone-image-wrapper {
  height: 14rem;
  width: 100%;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-slate-100);
  position: relative;
  overflow: hidden;
}

@media (prefers-color-scheme: dark) {
  .drone-image-wrapper {
    background-color: #141e28;
  }
}

.drone-image {
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 25px 50px -12px rgba(0, 0, 0, 0.25));
  z-index: 10;
  transition: transform 0.5s;
}

.drone-card:hover .drone-image {
  transform: scale(1.1);
}

.drone-image-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(25, 127, 230, 0.05);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.drone-card:hover .drone-image-overlay {
  opacity: 1;
}

.drone-available-soon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 20;
  background-color: rgba(255, 193, 7, 0.95);
  color: var(--color-slate-900);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

@media (prefers-color-scheme: dark) {
  .drone-available-soon {
    background-color: rgba(255, 193, 7, 0.9);
    color: var(--color-slate-900);
  }
}

.drone-content {
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.drone-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.drone-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-slate-900);
  margin: 0;
}

@media (prefers-color-scheme: dark) {
  .drone-name {
    color: var(--color-white);
  }
}

.drone-category {
  background-color: rgba(25, 127, 230, 0.2);
  color: var(--color-primary);
  font-size: 0.625rem;
  font-weight: 900;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-md);
  letter-spacing: 0.1em;
}

.drone-description {
  color: var(--color-slate-500);
  font-size: 0.875rem;
  margin-bottom: 2rem;
  line-height: 1.75;
}

@media (prefers-color-scheme: dark) {
  .drone-description {
    color: var(--color-text-secondary);
  }
}

.drone-stats {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.drone-stat {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.drone-stat-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.drone-stat-label {
  color: var(--color-slate-500);
  font-weight: 500;
}

@media (prefers-color-scheme: dark) {
  .drone-stat-label {
    color: var(--color-slate-400);
  }
}

.drone-stat-value {
  font-family: ui-monospace, monospace;
  font-weight: 700;
  color: var(--color-slate-900);
}

@media (prefers-color-scheme: dark) {
  .drone-stat-value {
    color: var(--color-white);
  }
}

.drone-stat-bar {
  width: 100%;
  background-color: var(--color-slate-200);
  height: 0.5rem;
  border-radius: 9999px;
  overflow: hidden;
}

@media (prefers-color-scheme: dark) {
  .drone-stat-bar {
    background-color: var(--color-dark-border);
  }
}

.drone-stat-bar-fill {
  background-color: var(--color-primary);
  height: 100%;
  border-radius: 9999px;
  transition: all var(--transition-base);
}

.drone-card:hover .drone-stat-bar-fill {
  background-color: #60a5fa;
}

/* CTA Section */
.cta-section {
  background-color: var(--color-dark-bg);
  width: 100%;
  padding: 6rem 1rem;
  border-top: 1px solid var(--color-dark-border);
}

.cta-card {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 2rem;
  overflow: hidden;
  position: relative;
  background-color: var(--color-dark-surface);
  box-shadow: var(--shadow-2xl);
}

.cta-background {
  position: absolute;
  inset: 0;
  opacity: 0.4;
  background-size: cover;
  background-position: center;
}

.cta-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, var(--color-dark-surface), rgba(17, 25, 33, 0.9), transparent);
}

.cta-content {
  position: relative;
  z-index: 10;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
}

@media (min-width: 768px) {
  .cta-content {
    padding: 5rem;
    flex-direction: row;
  }
}

.cta-text {
  max-width: 36rem;
  text-align: center;
}

@media (min-width: 768px) {
  .cta-text {
    text-align: left;
  }
}

.cta-title {
  color: var(--color-white);
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  margin-bottom: 1.5rem;
  margin-top: 0;
}

@media (min-width: 768px) {
  .cta-title {
    font-size: 3rem;
  }
}

.cta-description {
  color: rgb(203, 213, 225);
  font-size: 1.125rem;
  margin-bottom: 2.5rem;
  line-height: 1.75;
}

@media (min-width: 768px) {
  .cta-description {
    font-size: 1.25rem;
  }
}

.cta-buttons {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  justify-content: center;
}

@media (min-width: 640px) {
  .cta-buttons {
    flex-direction: row;
  }
}

@media (min-width: 768px) {
  .cta-buttons {
    justify-content: flex-start;
  }
}

.cta-button-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  font-weight: 700;
  padding: 1rem 2.5rem;
  border-radius: var(--radius-xl);
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: 0 20px 25px -5px rgba(25, 127, 230, 0.3);
}

.cta-button-primary:hover {
  background-color: #1566c4;
  transform: scale(1.05);
}

.cta-button-secondary {
  background-color: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: var(--color-white);
  font-weight: 700;
  padding: 1rem 2.5rem;
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all var(--transition-base);
  backdrop-filter: blur(4px);
}

.cta-button-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.cta-visual {
  display: none;
}

@media (min-width: 1024px) {
  .cta-visual {
    display: flex;
    height: 11rem;
    width: 11rem;
    border-radius: 9999px;
    border: 2px solid rgba(25, 127, 230, 0.2);
    align-items: center;
    justify-content: center;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.cta-circle-outer {
  height: 8rem;
  width: 8rem;
  border-radius: 9999px;
  border: 4px solid rgba(25, 127, 230, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-base);
}

.cta-visual:hover .cta-circle-outer {
  transform: scale(1.1);
}

.cta-icon {
  font-size: 3rem;
  color: var(--color-primary);
  font-weight: 300;
}
</style>
