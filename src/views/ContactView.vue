<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { LMap, LTileLayer, LMarker, LCircle } from '@vue-leaflet/vue-leaflet';
import axios from 'axios';
// @ts-ignore - Leaflet types are available but may not be recognized
import * as L from 'leaflet';

interface ContactFormData {
  name: string;
  company: string;
  email: string;
  projectType: string;
  projectDate: string;
  location: string;
  description: string;
}

const { t } = useI18n();

const contactInfo = computed(() => [
  { icon: 'call', label: t('contact.info.directLine'), value: '+33 06 51 14 72 19' },
  { icon: 'mail', label: t('contact.info.emailInquiry'), value: 'gregory.marshall999@gmail.com' },
  { icon: 'location_on', label: t('contact.info.baseOfOps'), value: 'France' }
]);

const faqs = computed(() => [
  { q: t('contact.faq.questions.weather.q'), a: t('contact.faq.questions.weather.a') },
  { q: t('contact.faq.questions.licensed.q'), a: t('contact.faq.questions.licensed.a') },
  { q: t('contact.faq.questions.turnaround.q'), a: t('contact.faq.questions.turnaround.a') },
  { q: t('contact.faq.questions.present.q'), a: t('contact.faq.questions.present.a') }
]);

const projectTypes = computed(() => [
  t('contact.projectTypes.realEstatePhotography'),
  t('contact.projectTypes.technicalInspection'),
  t('contact.projectTypes.eventCoverage'),
  t('contact.projectTypes.cinematography'),
  t('contact.projectTypes.other')
]);

const formData = ref<ContactFormData>({
  name: '',
  company: '',
  email: '',
  projectType: '',
  projectDate: '',
  location: '',
  description: ''
});

// Initialize projectType when projectTypes are available
watchEffect(() => {
  if (projectTypes.value.length > 0 && !formData.value.projectType) {
    formData.value.projectType = projectTypes.value[0] || '';
  }
});

const isLoading = ref(false);
const submitError = ref<string | null>(null);
const submitSuccess = ref(false);

const handleSubmit = async () => {
  // Reset states
  submitError.value = null;
  submitSuccess.value = false;
  isLoading.value = true;

  try {
    // Prepare form data for API
    const payload = {
      name: formData.value.name.trim(),
      email: formData.value.email.trim(),
      projectType: formData.value.projectType,
      description: formData.value.description.trim(),
      ...(formData.value.company.trim() && { company: formData.value.company.trim() }),
      ...(formData.value.projectDate && { projectDate: formData.value.projectDate }),
      ...(formData.value.location.trim() && { location: formData.value.location.trim() })
    };

    // Submit to webhook
    await axios.post(import.meta.env.VITE_CONTACT_SERVICE, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Success
    submitSuccess.value = true;
    
    // Reset form after successful submission
    formData.value = {
      name: '',
      company: '',
      email: '',
      projectType: projectTypes.value[0] || '',
      projectDate: '',
      location: '',
      description: ''
    };

    // Clear success message after 5 seconds
    setTimeout(() => {
      submitSuccess.value = false;
    }, 5000);
  } catch (error: any) {
    // Handle errors
    if (error.response?.data?.message) {
      submitError.value = error.response.data.message;
    } else if (error.response?.data?.errors) {
      // Handle validation errors
      const errors = error.response.data.errors;
      submitError.value = Array.isArray(errors) 
        ? errors.map((e: any) => e.msg || e).join(', ')
        : String(errors);
    } else if (error.message) {
      submitError.value = error.message;
    } else {
      submitError.value = 'Failed to submit contact form. Please try again later.';
    }
  } finally {
    isLoading.value = false;
  }
};

// Map configuration - France (Paris coordinates)
const mapCenter = [48.8566, 2.3522]; // Paris, France
const mapZoom = ref(6); // Initial zoom level, will be adjusted to fit circle
// 500 miles in meters (1 mile = 1609.34 meters)
const serviceRadiusMeters = 500 * 1609.34; // Approximately 804,670 meters

// Map reference
const mapRef = ref<InstanceType<typeof LMap> | null>(null);

// Calculate bounds to fit the circle
const calculateCircleBounds = () => {
  const center = L.latLng(mapCenter[0], mapCenter[1]);
  // Convert radius from meters to degrees
  // Latitude: 1 degree ≈ 111,320 meters (constant)
  // Longitude: varies by latitude, 1 degree ≈ 111,320 * cos(latitude) meters
  const latRadius = serviceRadiusMeters / 111320;
  const lngRadius = serviceRadiusMeters / (111320 * Math.cos(center.lat * Math.PI / 180));
  
  return L.latLngBounds(
    [center.lat - latRadius, center.lng - lngRadius],
    [center.lat + latRadius, center.lng + lngRadius]
  );
};

// Fit map to circle bounds when map is ready
const onMapReady = () => {
  if (mapRef.value?.leafletObject) {
    const bounds = calculateCircleBounds();
    mapRef.value.leafletObject.fitBounds(bounds, {
      padding: [20, 20], // Add some padding around the circle
      maxZoom: 10 // Limit max zoom to prevent too close view
    });
  }
};

// Circle styling options
const circleOptions = {
  color: '#197FE6', // Primary color
  fillColor: '#197FE6',
  fillOpacity: 0.1,
  weight: 2,
  opacity: 0.6
};

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});
</script>

<template>
  <div class="contact-view animate-in slide-in-from-bottom-4">
    <!-- Hero Section -->
    <section class="contact-hero">
      <div class="contact-hero-container">
        <div 
          class="contact-hero-card"
          :style="{ backgroundImage: `linear-gradient(rgba(17, 26, 34, 0.7) 0%, rgba(17, 26, 34, 0.9) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBVYHEUUbs1tVGwVXjkSsflO4WRhnv07B_CbqC96EXXMdTtpY-TCOcUhfLoHAz2FR-FqVXrhv05bKpx2lE3lU4m4Ue1uPoYmBTEPeI0pXmW8MfMzXD3BBtZyfHswZI3wN3C-sLNxRW_N2nTQokI5W06_7inHWUSdHvIeXrbqJy-4an41_kGT71wlZHF4aD_lUE8oFPcOY4Q-nHaoSRXlam1MrxoCC3eOsksvmBafBMyJAnr4apC0zEV6virnVr23Xa2frYt64Zil4dE')` }"
        >
          <div class="contact-hero-content">
            <h1 class="contact-hero-title">
              {{ t('contact.hero.title') }} <br/><span class="contact-hero-title-accent">{{ t('contact.hero.titleAccent') }}</span>
            </h1>
            <p class="contact-hero-description">
              {{ t('contact.hero.description') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Grid -->
    <section class="contact-main">
      <div class="contact-grid">
        <!-- Left Column: Info -->
        <div class="contact-info">
          <div class="contact-info-section">
            <h2 class="contact-info-title">
              <div class="contact-info-title-bar"></div>
              {{ t('contact.info.title') }}
            </h2>
            
            <div class="contact-info-list">
              <div 
                v-for="(item, i) in contactInfo" 
                :key="i" 
                class="contact-info-item"
              >
                <div class="contact-info-icon-wrapper">
                  <span class="material-symbols-outlined contact-info-icon">{{ item.icon }}</span>
                </div>
                <div class="contact-info-details">
                  <span class="contact-info-label">{{ item.label }}</span>
                  <p class="contact-info-value">{{ item.value }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Map -->
          <div class="contact-map">
            <LMap
              ref="mapRef"
              :zoom="mapZoom"
              :center="mapCenter"
              :options="{ zoomControl: false }"
              class="contact-map-container"
              @ready="onMapReady"
            >
              <LTileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LCircle
                :lat-lng="mapCenter"
                :radius="serviceRadiusMeters"
                :options="circleOptions"
              />
              <LMarker :lat-lng="mapCenter" />
            </LMap>
            <div class="contact-map-badge">
              {{ t('contact.info.serviceRadius') }}
            </div>
          </div>

          <div class="contact-social">
            <a 
              href="https://www.instagram.com/gremmarshall?igsh=MXdjMnhvZHJ3b2UxaQ==" 
              target="_blank" 
              rel="noopener noreferrer"
              class="contact-social-button"
            >
              <span class="material-symbols-outlined contact-social-icon">photo_camera</span>
              <span class="contact-social-text">Instagram</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/gregorymarshall999" 
              target="_blank" 
              rel="noopener noreferrer"
              class="contact-social-button"
            >
              <span class="material-symbols-outlined contact-social-icon">work</span>
              <span class="contact-social-text">LinkedIn</span>
            </a>
          </div>
        </div>

        <!-- Right Column: Form -->
        <div class="contact-form-wrapper">
          <div class="contact-form-card">
            <div class="contact-form-glow"></div>
            <h2 class="contact-form-title">{{ t('contact.form.title') }}</h2>
            <p class="contact-form-subtitle">{{ t('contact.form.subtitle') }}</p>
            
            <form @submit.prevent="handleSubmit" class="contact-form">
              <div class="form-row">
                <div class="form-field">
                  <label class="form-label" for="name">{{ t('contact.form.yourName') }}</label>
                  <input 
                    v-model="formData.name"
                    class="form-input"
                    :placeholder="t('contact.form.namePlaceholder')" 
                    type="text" 
                  />
                </div>
                <div class="form-field">
                  <label class="form-label" for="company">{{ t('contact.form.companyName') }}</label>
                  <input 
                    v-model="formData.company"
                    class="form-input"
                    :placeholder="t('contact.form.companyPlaceholder')" 
                    type="text" 
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-field">
                  <label class="form-label" for="email">{{ t('contact.form.email') }}</label>
                  <input 
                    v-model="formData.email"
                    class="form-input"
                    :placeholder="t('contact.form.emailPlaceholder')" 
                    type="email" 
                  />
                </div>
                <div class="form-field">
                  <label class="form-label" for="projectType">{{ t('contact.form.projectType') }}</label>
                  <div class="select-wrapper">
                    <select 
                      v-model="formData.projectType"
                      class="form-select"
                    >
                      <option v-for="type in projectTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                    <span class="material-symbols-outlined select-arrow">expand_more</span>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-field">
                  <label class="form-label" for="projectDate">{{ t('contact.form.projectDate') }}</label>
                  <input 
                    v-model="formData.projectDate"
                    class="form-input"
                    type="date" 
                  />
                </div>
                <div class="form-field">
                  <label class="form-label" for="location">{{ t('contact.form.location') }}</label>
                  <div class="input-wrapper-location">
                    <input 
                      v-model="formData.location"
                      class="form-input form-input-location"
                      :placeholder="t('contact.form.locationPlaceholder')" 
                      type="text" 
                    />
                    <span class="material-symbols-outlined input-icon-location">location_on</span>
                  </div>
                </div>
              </div>

              <div class="form-field form-field-full">
                <label class="form-label" for="description">{{ t('contact.form.description') }}</label>
                <textarea 
                  v-model="formData.description"
                  class="form-textarea"
                  :placeholder="t('contact.form.descriptionPlaceholder')"
                ></textarea>
              </div>

              <!-- Success Message -->
              <div v-if="submitSuccess" class="form-message form-message-success">
                <span class="material-symbols-outlined form-message-icon">check_circle</span>
                <span>{{ t('contact.form.successMessage') || 'Thank you! Your message has been sent successfully.' }}</span>
              </div>

              <!-- Error Message -->
              <div v-if="submitError" class="form-message form-message-error">
                <span class="material-symbols-outlined form-message-icon">error</span>
                <span>{{ submitError }}</span>
              </div>

              <button type="submit" class="form-submit" :disabled="isLoading">
                <span v-if="!isLoading" class="form-submit-text">{{ t('contact.form.submit') }}</span>
                <span v-else class="form-submit-text">{{ t('contact.form.submitting') || 'Submitting...' }}</span>
                <span v-if="!isLoading" class="material-symbols-outlined form-submit-icon">send</span>
                <span v-else class="material-symbols-outlined form-submit-icon form-submit-icon-spinning">hourglass_empty</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="contact-faq">
      <div class="contact-faq-container">
        <h3 class="contact-faq-title">{{ t('contact.faq.title') }}</h3>
        <div class="contact-faq-grid">
          <details 
            v-for="(faq, idx) in faqs" 
            :key="idx" 
            class="faq-item"
          >
            <summary class="faq-question">
              <span class="faq-question-text">{{ faq.q }}</span>
              <span class="material-symbols-outlined faq-arrow">expand_more</span>
            </summary>
            <div class="faq-answer">
              {{ faq.a }}
            </div>
          </details>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@import '../assets/variables.css';

.contact-view {
  animation-duration: 0.7s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
  background-color: var(--color-background-dark);
  min-height: 100vh;
  color: var(--color-white);
}

/* Hero Section */
.contact-hero {
  padding: 3rem 1rem;
}

@media (min-width: 1024px) {
  .contact-hero {
    padding: 4rem 10rem;
  }
}

.contact-hero-container {
  margin: 0 auto;
  max-width: 1000px;
}

.contact-hero-card {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem;
  gap: 1.5rem;
  box-shadow: var(--shadow-2xl);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.contact-hero-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 42rem;
}

.contact-hero-title {
  font-size: 2.25rem;
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: -0.025em;
  margin: 0;
}

@media (min-width: 1024px) {
  .contact-hero-title {
    font-size: 3.75rem;
  }
}

.contact-hero-title-accent {
  color: var(--color-primary);
}

.contact-hero-description {
  color: var(--color-slate-400);
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.75;
}

@media (min-width: 1024px) {
  .contact-hero-description {
    font-size: 1.25rem;
  }
}

/* Main Grid */
.contact-main {
  padding: 0 1rem 6rem;
}

@media (min-width: 1024px) {
  .contact-main {
    padding-left: 10rem;
    padding-right: 10rem;
  }
}

.contact-grid {
  margin: 0 auto;
  max-width: 1000px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 1024px) {
  .contact-grid {
    grid-template-columns: repeat(12, 1fr);
    gap: 4rem;
  }
}

/* Contact Info */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

@media (min-width: 1024px) {
  .contact-info {
    grid-column: span 5;
  }
}

.contact-info-section {
  flex: 1;
}

.contact-info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.025em;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0;
}

.contact-info-title-bar {
  width: 2rem;
  height: 0.25rem;
  background-color: var(--color-primary);
  border-radius: 9999px;
}

.contact-info-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.contact-info-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem;
  border-radius: var(--radius-2xl);
  background-color: var(--color-surface-dark);
  border: 1px solid rgba(36, 58, 71, 0.4);
  cursor: pointer;
  transition: all var(--transition-base);
}

.contact-info-item:hover {
  border-color: rgba(25, 127, 230, 0.5);
}

.contact-info-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  background-color: var(--color-surface-highlight);
  color: var(--color-primary);
  flex-shrink: 0;
  width: 3.5rem;
  height: 3.5rem;
  transition: all var(--transition-base);
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

.contact-info-item:hover .contact-info-icon-wrapper {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.contact-info-icon {
  font-size: 1.5rem;
}

.contact-info-details {
  display: flex;
  flex-direction: column;
}

.contact-info-label {
  font-size: 0.75rem;
  color: var(--color-slate-400);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.contact-info-value {
  font-size: 1.125rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
}

.contact-map {
  border-radius: var(--radius-2xl);
  overflow: hidden;
  border: 1px solid rgba(36, 58, 71, 0.5);
  height: 14rem;
  position: relative;
  box-shadow: var(--shadow-2xl);
}

.contact-map-container {
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* Dark theme for Leaflet map */
.contact-map-container :deep(.leaflet-container) {
  background-color: var(--color-background-dark);
}

.contact-map-container :deep(.leaflet-tile-pane) {
  filter: brightness(0.7) contrast(1.1);
}

.contact-map-container :deep(.leaflet-control-zoom) {
  border: none;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.contact-map-container :deep(.leaflet-control-zoom a) {
  background-color: var(--color-surface-dark);
  color: var(--color-white);
  border: 1px solid rgba(36, 58, 71, 0.5);
}

.contact-map-container :deep(.leaflet-control-zoom a:hover) {
  background-color: var(--color-surface-highlight);
  border-color: var(--color-primary);
}

.contact-map-container :deep(.leaflet-popup-content-wrapper) {
  background-color: var(--color-surface-dark);
  color: var(--color-white);
  border-radius: var(--radius-lg);
}

.contact-map-container :deep(.leaflet-popup-tip) {
  background-color: var(--color-surface-dark);
}

.contact-map-badge {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  z-index: 20;
  background-color: rgba(26, 38, 50, 0.9);
  backdrop-filter: blur(12px);
  padding: 0.375rem 1rem;
  border-radius: var(--radius-lg);
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-lg);
}

.contact-social {
  display: flex;
  gap: 1rem;
}

.contact-social-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: var(--radius-xl);
  background-color: var(--color-surface-dark);
  border: 1px solid rgba(36, 58, 71, 0.5);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-lg);
  /* Remove default link styles */
  text-decoration: none;
  color: inherit;
  outline: none;
}

.contact-social-button:hover {
  background-color: var(--color-surface-highlight);
  text-decoration: none;
  color: inherit;
}

.contact-social-button:visited {
  color: inherit;
  text-decoration: none;
}

.contact-social-button:focus {
  outline: none;
  text-decoration: none;
}

.contact-social-button:active {
  color: inherit;
  text-decoration: none;
}

.contact-social-icon {
  font-size: 1.25rem;
  color: var(--color-primary);
}

.contact-social-text {
  font-size: 0.875rem;
  font-weight: 700;
}

/* Contact Form */
.contact-form-wrapper {
  width: 100%;
}

@media (min-width: 1024px) {
  .contact-form-wrapper {
    grid-column: span 7;
  }
}

.contact-form-card {
  background-color: var(--color-surface-dark);
  border-radius: 2rem;
  padding: 2rem;
  border: 1px solid var(--color-surface-highlight);
  box-shadow: var(--shadow-2xl);
  position: relative;
  overflow: hidden;
}

@media (min-width: 1024px) {
  .contact-form-card {
    padding: 3rem;
  }
}

.contact-form-glow {
  position: absolute;
  top: 0;
  right: 0;
  width: 8rem;
  height: 8rem;
  background-color: rgba(25, 127, 230, 0.1);
  filter: blur(60px);
  border-radius: 9999px;
}

.contact-form-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  position: relative;
  z-index: 10;
  margin-top: 0;
}

.contact-form-subtitle {
  color: var(--color-slate-400);
  font-size: 1rem;
  margin-bottom: 2.5rem;
  position: relative;
  z-index: 10;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  z-index: 10;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .form-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field-full {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: rgb(203, 213, 225);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.form-input,
.form-select,
.form-textarea {
  height: 3.5rem;
  width: 100%;
  border-radius: var(--radius-xl);
  background-color: var(--color-background-dark);
  border: 1px solid var(--color-surface-highlight);
  padding: 0 1.25rem;
  font-size: 1rem;
  color: var(--color-white);
  transition: all var(--transition-base);
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(25, 127, 230, 0.2), inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

.form-input::placeholder {
  color: var(--color-slate-500);
}

.form-textarea {
  height: 10rem;
  resize: none;
  padding: 1.25rem;
}

.select-wrapper {
  position: relative;
}

.form-select {
  appearance: none;
  cursor: pointer;
  padding-right: 2.5rem;
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-slate-400);
  pointer-events: none;
}

.input-wrapper-location {
  position: relative;
}

.form-input-location {
  padding-left: 3rem;
}

.input-icon-location {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-primary);
  font-size: 1.25rem;
  font-weight: 300;
  pointer-events: none;
}

.form-submit {
  margin-top: 1rem;
  display: flex;
  height: 4rem;
  width: 100%;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border-radius: var(--radius-xl);
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 0 2rem;
  font-size: 1.125rem;
  font-weight: 700;
  border: none;
  transition: all var(--transition-base);
  box-shadow: 0 25px 50px -12px rgba(25, 127, 230, 0.3);
}

.form-submit:hover {
  background-color: #1566c4;
  transform: scale(1.01);
}

.form-submit:active {
  transform: scale(0.98);
}

.form-submit-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.form-submit-icon {
  font-size: 1.5rem;
  font-weight: 300;
}

.form-submit-icon-spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.form-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.form-submit:disabled:hover {
  background-color: var(--color-primary);
  transform: none;
}

.form-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.5rem;
}

.form-message-success {
  background-color: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #4ade80;
}

.form-message-error {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
}

.form-message-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

/* FAQ Section */
.contact-faq {
  padding: 0 1rem 6rem;
}

@media (min-width: 1024px) {
  .contact-faq {
    padding-left: 10rem;
    padding-right: 10rem;
  }
}

.contact-faq-container {
  margin: 0 auto;
  max-width: 1000px;
}

.contact-faq-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: 2.5rem;
  padding-left: 1rem;
  border-left: 4px solid var(--color-primary);
  margin-top: 0;
}

.contact-faq-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .contact-faq-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.faq-item {
  background-color: var(--color-surface-dark);
  border-radius: var(--radius-2xl);
  border: 1px solid rgba(36, 58, 71, 0.5);
  transition: all var(--transition-base);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.faq-question {
  display: flex;
  cursor: pointer;
  list-style: none;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  font-weight: 700;
  color: var(--color-white);
  transition: background-color var(--transition-base);
}

.faq-question:hover {
  background-color: rgba(36, 58, 71, 0.3);
}

.faq-question-text {
  font-size: 1.125rem;
}

.faq-arrow {
  transition: transform var(--transition-base);
}

.faq-item[open] .faq-arrow {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 1.5rem 1.5rem;
  color: var(--color-slate-400);
  line-height: 1.75;
  font-size: 1rem;
}
</style>
