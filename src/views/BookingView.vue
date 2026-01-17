<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useBookingStore } from '../stores/booking';
import { SERVICES, FLEET } from '../constants';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
// @ts-ignore - Leaflet types are available but may not be recognized
import * as L from 'leaflet';

const { t } = useI18n();
const bookingStore = useBookingStore();

// Map service IDs to service keys for i18n
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

// Convert SERVICES to profiles with active state
const selectedProfileId = ref<string | null>(null);

const profiles = computed(() => {
  return SERVICES.map(service => {
    const serviceKey = getServiceKey(service.id);
    return {
      id: service.id,
      label: t(`services.${serviceKey}.title`),
      labelKey: serviceKey,
      img: service.imageUrl,
      active: selectedProfileId.value === service.id
    };
  });
});

const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM'
];

const selectProfile = (profile: typeof profiles.value[0]) => {
  selectedProfileId.value = profile.id;
  bookingStore.setSelectedProfile(profile.label);
};

const selectTime = (time: string) => {
  bookingStore.setStartTime(time);
};

// Drone selection
const drones = computed(() => {
  return FLEET.map(drone => ({
    ...drone,
    active: bookingStore.selectedDrone?.id === drone.id
  }));
});

const selectDrone = (drone: typeof drones.value[0]) => {
  bookingStore.setSelectedDrone(drone);
};

// Collapsible alternatives menu
const showAlternatives = ref(false);

const toggleAlternatives = () => {
  showAlternatives.value = !showAlternatives.value;
};

const alternativesCount = computed(() => {
  return FLEET.length - 1; // All drones except the selected one
});

// Map configuration
const mapCenter = ref<[number, number]>([48.8566, 2.3522]); // Paris, France default
const mapZoom = ref(13); // Zoom level for location selection
const mapRef = ref<InstanceType<typeof LMap> | null>(null);
const markerPosition = ref<[number, number] | null>(null);
const isUpdatingFromMap = ref(false); // Flag to prevent circular updates

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Geocode address to coordinates using Nominatim API
const geocodeAddress = async (address: string) => {
  if (!address.trim()) {
    markerPosition.value = null;
    return;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'User-Agent': 'DroneOps Booking App' // Required by Nominatim
        }
      }
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      const coords: [number, number] = [Number.parseFloat(lat), Number.parseFloat(lon)];
      markerPosition.value = coords;
      mapCenter.value = coords;
      
      if (mapRef.value?.leafletObject) {
        mapRef.value.leafletObject.setView(coords, mapZoom.value);
      }
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
};

// Reverse geocode coordinates to address
const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'DroneOps Booking App' // Required by Nominatim
        }
      }
    );
    const data = await response.json();
    
    if (data && data.address) {
      const address = data.display_name || 
        `${data.address.road || ''} ${data.address.house_number || ''}, ${data.address.city || data.address.town || data.address.village || ''}`.trim();
      
      if (address) {
        isUpdatingFromMap.value = true;
        bookingStore.location = address;
        // Reset flag after a short delay
        setTimeout(() => {
          isUpdatingFromMap.value = false;
        }, 100);
      }
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
  }
};

// Watch location input and geocode when it changes
let geocodeTimeout: ReturnType<typeof setTimeout> | null = null;
watch(() => bookingStore.location, (newLocation) => {
  // Don't geocode if update is coming from map click
  if (isUpdatingFromMap.value) {
    return;
  }

  // Debounce geocoding to avoid too many API calls
  if (geocodeTimeout) {
    clearTimeout(geocodeTimeout);
  }
  
  geocodeTimeout = setTimeout(() => {
    if (newLocation) {
      geocodeAddress(newLocation);
    } else {
      markerPosition.value = null;
    }
  }, 500); // Wait 500ms after user stops typing
});

// Handle map click to set location
const onMapClick = async (event: any) => {
  const { lat, lng } = event.latlng;
  markerPosition.value = [lat, lng];
  mapCenter.value = [lat, lng];

  // Reverse geocode to update the location input
  await reverseGeocode(lat, lng);
  
  // Update map view
  if (mapRef.value?.leafletObject) {
    mapRef.value.leafletObject.setView([lat, lng], mapZoom.value);
  }
};

// Fit map to marker when map is ready
const onMapReady = () => {
  if (mapRef.value?.leafletObject && markerPosition.value) {
    mapRef.value.leafletObject.setView(markerPosition.value, mapZoom.value);
  }
};

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

const getDroneKey = (id: string) => {
  const keyMap: Record<string, string> = {
    'avata-2': 'avata2',
    'mavic-3': 'mavic3',
    'fpv-x8': 'fpvX8',
    'matrice-300': 'matrice300'
  };
  return keyMap[id] || id;
};
</script>

<template>
  <div class="booking-view animate-in fade-in">
    <div class="booking-container">
      <!-- Left Column: Mission Builder -->
      <div class="booking-main">
        <!-- Header & Progress -->
        <div class="booking-header">
          <div class="booking-title-section">
            <h1 class="booking-title">{{ t('booking.title') }}</h1>
            <p class="booking-subtitle">{{ t('booking.subtitle') }}</p>
          </div>
          
          <div class="progress-section">
            <div class="progress-header">
              <p class="progress-status">{{ t('booking.progress.status') }}</p>
              <p class="progress-step">{{ t('booking.progress.step', { current: 3, total: 5 }) }}</p>
            </div>
            <div class="progress-bar">
              <div class="progress-bar-fill" style="width: 60%"></div>
            </div>
            <div class="progress-steps">
              <span class="progress-step-item progress-step-complete">{{ t('booking.progress.steps.profile') }}</span>
              <span class="progress-step-item progress-step-complete">{{ t('booking.progress.steps.location') }}</span>
              <span class="progress-step-item progress-step-active">{{ t('booking.progress.steps.equipment') }}</span>
              <span class="progress-step-item">{{ t('booking.progress.steps.billing') }}</span>
            </div>
          </div>
        </div>

        <!-- Step 1: Profile -->
        <section class="booking-step">
          <div class="step-header">
            <span class="step-number step-number-complete">1</span>
            <h2 class="step-title">{{ t('booking.profile.title') }}</h2>
            <span class="material-symbols-outlined step-check">check_circle</span>
          </div>
          <div class="profile-grid">
            <div 
              v-for="p in profiles" 
              :key="p.id" 
              @click="selectProfile(p)"
              :class="['profile-card', { 'profile-card-active': p.active }]"
            >
              <div v-if="p.active" class="profile-badge">{{ t('common.selected') }}</div>
              <div class="profile-gradient"></div>
              <img class="profile-image" :src="p.img" :alt="p.label" />
              <p class="profile-label">{{ p.label }}</p>
            </div>
          </div>
        </section>

        <!-- Step 2: Location -->
        <section class="booking-step">
          <div class="step-header">
            <span class="step-number step-number-complete">2</span>
            <h2 class="step-title">{{ t('booking.location.title') }}</h2>
            <span class="material-symbols-outlined step-check">check_circle</span>
          </div>
          <div class="location-grid">
            <div class="location-section">
              <div class="form-group">
                <label class="form-label">{{ t('booking.location.targetLocation') }}</label>
                <div class="input-wrapper">
                  <span class="material-symbols-outlined input-icon">search</span>
                  <input 
                    v-model="bookingStore.location"
                    class="form-input"
                    type="text" 
                  />
                </div>
              </div>
              <div class="map-container">
                <LMap
                  ref="mapRef"
                  :zoom="mapZoom"
                  :center="mapCenter"
                  :options="{ zoomControl: true }"
                  class="booking-map-container"
                  @click="onMapClick"
                  @ready="onMapReady"
                >
                  <LTileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LMarker 
                    v-if="markerPosition" 
                    :lat-lng="markerPosition" 
                  />
                </LMap>
              </div>
            </div>
            
            <div class="schedule-section">
              <div class="form-group">
                <label class="form-label">{{ t('booking.location.missionDate') }}</label>
                <div class="input-wrapper">
                  <span class="material-symbols-outlined input-icon">calendar_month</span>
                  <input 
                    v-model="bookingStore.missionDate"
                    class="form-input"
                    type="date" 
                  />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">{{ t('booking.location.startTime') }}</label>
                <div class="time-slots">
                  <button 
                    v-for="time in timeSlots" 
                    :key="time"
                    @click="selectTime(time)"
                    :class="['time-slot', { 'time-slot-active': time === bookingStore.startTime }]"
                  >
                    {{ time }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Step 3: Equipment -->
        <section class="booking-step">
          <div class="step-header">
            <span class="step-number step-number-active">3</span>
            <h2 class="step-title">{{ t('booking.equipment.title') }}</h2>
          </div>
          
          <!-- Selected Drone Details -->
          <div v-if="bookingStore.selectedDrone" class="drone-selection-card">
            <div class="drone-selection-badge">
              <span class="material-symbols-outlined">auto_awesome</span> {{ t('booking.equipment.bestPerformance') }}
            </div>
            <div class="drone-selection-image-wrapper">
              <img class="drone-selection-image" :src="bookingStore.selectedDrone.imageUrl" :alt="bookingStore.selectedDrone.name" />
              <div class="drone-selection-gradient"></div>
            </div>
            <div class="drone-selection-content">
              <div class="drone-selection-info">
                <div class="drone-selection-header">
                  <h3 class="drone-selection-name">{{ t(`fleet.${getDroneKey(bookingStore.selectedDrone.id)}.name`) }}</h3>
                  <div class="drone-selection-price">
                    <p class="drone-price">€{{ bookingStore.selectedDrone.price }}</p>
                    <p class="drone-price-label">{{ t('common.perDay') }}</p>
                  </div>
                </div>
                <p class="drone-selection-description">{{ t(`fleet.${getDroneKey(bookingStore.selectedDrone.id)}.description`) }}</p>
              </div>
              <div class="drone-selection-stats">
                <span 
                  v-for="(s, i) in bookingStore.selectedDrone.stats" 
                  :key="i" 
                  class="drone-stat-badge"
                >
                  {{ s.value }} {{ getStatLabel(s.label) }}
                </span>
              </div>
              <div class="drone-selection-actions">
                <button class="drone-select-button">
                  {{ t('common.selected') }}
                  <span class="material-symbols-outlined drone-select-icon">check_circle</span>
                </button>
                <button class="drone-info-button">
                  <span class="material-symbols-outlined">info</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Drone Selection Grid or Collapsible Menu -->
          <div v-if="!bookingStore.selectedDrone" class="drone-grid">
            <div 
              v-for="drone in drones" 
              :key="drone.id" 
              @click="selectDrone(drone)"
              :class="['drone-card', { 'drone-card-active': drone.active }]"
            >
              <div v-if="drone.active" class="drone-card-badge">{{ t('common.selected') }}</div>
              <div v-if="drone.availableSoon" class="drone-card-available-soon">{{ t('fleet.availableSoon') }}</div>
              <div class="drone-card-gradient"></div>
              <img class="drone-card-image" :src="drone.imageUrl" :alt="drone.name" />
              <div class="drone-card-content">
                <h3 class="drone-card-name">{{ t(`fleet.${getDroneKey(drone.id)}.name`) }}</h3>
                <p class="drone-card-category">{{ t(`fleet.${getDroneKey(drone.id)}.category`) }}</p>
                <p class="drone-card-price">€{{ drone.price }}<span class="drone-card-price-label">/{{ t('common.perDay') }}</span></p>
              </div>
            </div>
          </div>

          <!-- Collapsible Alternatives Menu (shown when drone is selected) -->
          <div v-if="bookingStore.selectedDrone">
            <button class="alternatives-button" @click="toggleAlternatives">
              <span class="alternatives-text">{{ t('booking.equipment.viewAlternatives', { count: alternativesCount }) }}</span>
              <span class="material-symbols-outlined alternatives-icon" :class="{ 'alternatives-icon-expanded': showAlternatives }">expand_more</span>
            </button>
            
            <div v-if="showAlternatives" class="drone-grid">
              <div 
                v-for="drone in drones" 
                :key="drone.id" 
                @click="selectDrone(drone)"
                :class="['drone-card', { 'drone-card-active': drone.active }]"
              >
                <div v-if="drone.active" class="drone-card-badge">{{ t('common.selected') }}</div>
                <div v-if="drone.availableSoon" class="drone-card-available-soon">{{ t('fleet.availableSoon') }}</div>
                <div class="drone-card-gradient"></div>
                <img class="drone-card-image" :src="drone.imageUrl" :alt="drone.name" />
                <div class="drone-card-content">
                  <h3 class="drone-card-name">{{ t(`fleet.${getDroneKey(drone.id)}.name`) }}</h3>
                  <p class="drone-card-category">{{ t(`fleet.${getDroneKey(drone.id)}.category`) }}</p>
                  <p class="drone-card-price">€{{ drone.price }}<span class="drone-card-price-label">/{{ t('common.perDay') }}</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Step 4: Billing Preview -->
        <section class="booking-step booking-step-disabled">
          <div class="step-header">
            <span class="step-number step-number-disabled">4</span>
            <h2 class="step-title step-title-disabled">{{ t('booking.billing.title') }}</h2>
          </div>
          <div class="billing-placeholder">
             <div class="billing-locked">
               <span class="billing-locked-text">{{ t('booking.billing.moduleLocked') }}</span>
             </div>
          </div>
        </section>
      </div>

      <!-- Right Column: Sticky Summary -->
      <div class="booking-sidebar">
        <div class="summary-card">
          <div class="summary-header-bar"></div>
          <h3 class="summary-title">
            <div class="summary-icon-wrapper">
              <span class="material-symbols-outlined summary-icon">receipt_long</span>
            </div>
            {{ t('booking.summary.title') }}
          </h3>
          
          <div class="summary-items">
            <div class="summary-item">
              <span class="summary-item-label">{{ t('booking.summary.operatorFee') }}</span>
              <span class="summary-item-value">€320.00</span>
            </div>
            <div class="summary-item">
              <span class="summary-item-label">{{ t('booking.summary.equipmentRental') }}</span>
              <span class="summary-item-value">€{{ bookingStore.selectedDrone?.price?.toFixed(2) || '0.00' }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-item-label">{{ t('booking.summary.insurance') }}</span>
              <span class="summary-item-value">€85.00</span>
            </div>
            <div class="summary-item summary-item-discount">
              <span class="summary-item-label">
                <span class="material-symbols-outlined">confirmation_number</span>
                {{ t('booking.summary.platformDiscount') }}
              </span>
              <span class="summary-item-value">-€50.00</span>
            </div>
          </div>

          <div class="summary-total">
            <div class="summary-total-label">
              <span class="summary-total-text">{{ t('booking.summary.totalCost') }}</span>
              <span class="summary-total-currency">{{ t('booking.summary.currency') }}</span>
            </div>
            <span class="summary-total-amount">€{{ bookingStore.totalCost.toFixed(2) }}</span>
          </div>

          <button class="summary-button">
            {{ t('booking.summary.payReserve') }}
            <span class="material-symbols-outlined summary-button-icon">arrow_forward</span>
          </button>
          
          <p class="summary-security">
            {{ t('booking.summary.security') }}
          </p>
        </div>

        <!-- Operator Card -->
        <div class="operator-card">
          <div class="operator-avatar-wrapper">
            <img class="operator-avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8LSI_BSq-qiFSeRdTgjvPDSeuOkR56rJ_QZskcT8M2Pe5f7JtRExRnrZUcPOxwu3GT476adSZ8j262sr496l9EpjPj8LRrvgyjZQwCZIsstum0lXukjE0wxLpMG8W8_cXVXIRuiH-fR3FmDLUMcK3Gi89f12EVpdQCtJJGckD3CfIR4woPSmEB526vrzP12yXwBDRI2alxTVKUJPtwnplaFRPYW4x9NzIGS6hl6VImeH3DiF7YM-df4f31rYmFdI9kOhE4qOl5rA4" alt="Operator" />
            <div class="operator-status"></div>
          </div>
          <div class="operator-info">
            <span class="operator-name">Alex M.</span>
            <div class="operator-details">
              <span class="operator-role">{{ t('booking.operator.role') }}</span>
              <div class="operator-rating">
                <span class="material-symbols-outlined operator-star">star</span>
                <span class="operator-rating-value">4.9</span>
              </div>
            </div>
          </div>
          <span class="material-symbols-outlined operator-arrow">chevron_right</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/variables.css';

.booking-view {
  animation-duration: 0.7s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
  background-color: var(--color-background-dark);
  min-height: 100vh;
  color: var(--color-white);
  padding: 3rem 1rem;
}

@media (min-width: 768px) {
  .booking-view {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .booking-view {
    padding-left: 5rem;
    padding-right: 5rem;
  }
}

.booking-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 1024px) {
  .booking-container {
    grid-template-columns: repeat(12, 1fr);
    gap: 5rem;
  }
}

.booking-main {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

@media (min-width: 1024px) {
  .booking-main {
    grid-column: span 8;
  }
}

.booking-header {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.booking-title-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.booking-title {
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: -0.025em;
  line-height: 1.2;
  margin: 0;
}

.booking-subtitle {
  color: var(--color-text-secondary);
  font-size: 1.125rem;
  margin: 0;
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 1rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.progress-status {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
}

.progress-step {
  font-size: 0.875rem;
  font-weight: 900;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}

.progress-bar {
  border-radius: 9999px;
  height: 0.625rem;
  background-color: var(--color-surface-highlight);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: var(--color-primary);
  border-radius: 9999px;
  box-shadow: 0 0 15px rgba(25, 127, 230, 0.5);
  transition: all 1s;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  font-size: 0.6875rem;
  font-weight: 900;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.progress-step-item {
  color: var(--color-text-secondary);
}

.progress-step-complete {
  color: #10b981;
}

.progress-step-active {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 0.25rem;
}

.booking-step {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.booking-step-disabled {
  opacity: 0.4;
  filter: grayscale(100%);
  pointer-events: none;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-surface-highlight);
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: rgba(25, 127, 230, 0.2);
  color: var(--color-primary);
  font-weight: 900;
  font-size: 1.125rem;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

.step-number-active {
  background-color: var(--color-primary);
  color: var(--color-white);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.step-number-disabled {
  border: 2px solid var(--color-slate-600);
  background-color: transparent;
  color: var(--color-text-secondary);
}

.step-title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  margin: 0;
}

.step-title-disabled {
  color: var(--color-text-secondary);
}

.step-check {
  color: #10b981;
  margin-left: auto;
  font-size: 1.875rem;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .profile-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.profile-card {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: var(--radius-2xl);
  border: 2px solid transparent;
  transition: all 0.3s;
  filter: grayscale(100%);
}

.profile-card:hover {
  border-color: rgba(25, 127, 230, 0.5);
  filter: grayscale(0);
}

.profile-card-active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(25, 127, 230, 0.2), 0 25px 50px -12px rgba(25, 127, 230, 0.3);
  transform: scale(1.05);
  filter: grayscale(0);
}

.profile-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 20;
  background-color: var(--color-primary);
  color: var(--color-white);
  font-size: 0.625rem;
  font-weight: 900;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  box-shadow: var(--shadow-lg);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.profile-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.2), transparent);
  z-index: 10;
}

.profile-image {
  height: 10rem;
  width: 100%;
  object-fit: cover;
  transition: transform 0.7s;
}

.profile-card:hover .profile-image {
  transform: scale(1.1);
}

.profile-label {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  z-index: 20;
  font-weight: 900;
  color: var(--color-white);
  font-size: 1rem;
  letter-spacing: -0.025em;
  margin: 0;
}

.location-grid {
  display: grid;
  gap: 2.5rem;
}

@media (min-width: 768px) {
  .location-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.location-section,
.schedule-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-label {
  font-size: 0.75rem;
  font-weight: 900;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-primary);
  font-size: 1.5rem;
  font-weight: 300;
}

.form-input {
  width: 100%;
  background-color: rgba(36, 58, 71, 0.5);
  border: none;
  border-radius: var(--radius-2xl);
  padding: 1rem 1.25rem 1rem 3rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-white);
  transition: all var(--transition-base);
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

.form-input:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(25, 127, 230, 0.2), inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

.form-input::placeholder {
  color: var(--color-slate-500);
}

.map-container {
  position: relative;
  height: 12rem;
  width: 100%;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-2xl);
}

.booking-map-container {
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* Dark theme for Leaflet map */
.booking-map-container :deep(.leaflet-container) {
  background-color: var(--color-background-dark);
}

.booking-map-container :deep(.leaflet-tile-pane) {
  filter: brightness(0.7) contrast(1.1);
}

.booking-map-container :deep(.leaflet-control-zoom) {
  border: none;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.booking-map-container :deep(.leaflet-control-zoom a) {
  background-color: var(--color-surface-dark);
  color: var(--color-white);
  border: 1px solid rgba(36, 58, 71, 0.5);
}

.booking-map-container :deep(.leaflet-control-zoom a:hover) {
  background-color: var(--color-surface-highlight);
  border-color: var(--color-primary);
}

.booking-map-container :deep(.leaflet-popup-content-wrapper) {
  background-color: var(--color-surface-dark);
  color: var(--color-white);
  border-radius: var(--radius-lg);
}

.booking-map-container :deep(.leaflet-popup-tip) {
  background-color: var(--color-surface-dark);
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .time-slots {
    grid-template-columns: repeat(5, 1fr);
  }
}

.time-slot {
  padding: 0.75rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: var(--radius-xl);
  border: none;
  background-color: var(--color-surface-highlight);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-lg);
}

.time-slot:hover {
  background-color: #324a61;
}

.time-slot-active {
  background-color: var(--color-primary);
  color: var(--color-white);
  box-shadow: 0 0 0 4px rgba(25, 127, 230, 0.2);
}

.drone-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.drone-grid:has(+ .alternatives-button) {
  margin-top: 0;
  margin-bottom: 0;
}

.alternatives-button + .drone-grid {
  margin-top: 1.5rem;
}

@media (min-width: 768px) {
  .drone-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.drone-card {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: var(--radius-2xl);
  border: 2px solid transparent;
  transition: all 0.3s;
  filter: grayscale(100%);
  background-color: rgba(36, 58, 71, 0.3);
}

.drone-card:hover {
  border-color: rgba(25, 127, 230, 0.5);
  filter: grayscale(0);
}

.drone-card-active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(25, 127, 230, 0.2), 0 25px 50px -12px rgba(25, 127, 230, 0.3);
  transform: scale(1.05);
  filter: grayscale(0);
}

.drone-card-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 20;
  background-color: var(--color-primary);
  color: var(--color-white);
  font-size: 0.625rem;
  font-weight: 900;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  box-shadow: var(--shadow-lg);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.drone-card-available-soon {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 20;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  color: var(--color-white);
  font-size: 0.625rem;
  font-weight: 900;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  box-shadow: var(--shadow-lg);
}

.drone-card-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.2), transparent);
  z-index: 10;
}

.drone-card-image {
  height: 12rem;
  width: 100%;
  object-fit: cover;
  transition: transform 0.7s;
}

.drone-card:hover .drone-card-image {
  transform: scale(1.1);
}

.drone-card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 20;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.drone-card-name {
  font-size: 1rem;
  font-weight: 900;
  color: var(--color-white);
  letter-spacing: -0.025em;
  margin: 0;
}

.drone-card-category {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.drone-card-price {
  font-size: 1.125rem;
  font-weight: 900;
  color: var(--color-primary);
  margin: 0.25rem 0 0 0;
}

.drone-card-price-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.drone-selection-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: rgba(36, 58, 71, 0.4);
  border-radius: 2rem;
  overflow: hidden;
  border: 1px solid rgba(25, 127, 230, 0.4);
  box-shadow: var(--shadow-2xl);
  transition: all 0.5s;
}

.drone-selection-card:hover {
  border-color: var(--color-primary);
}

@media (min-width: 768px) {
  .drone-selection-card {
    flex-direction: row;
  }
}

.drone-selection-badge {
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--color-primary);
  color: var(--color-white);
  font-size: 0.625rem;
  font-weight: 900;
  padding: 0.375rem 1rem;
  border-bottom-right-radius: 2rem;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  box-shadow: var(--shadow-xl);
}

.drone-selection-badge .material-symbols-outlined {
  font-size: 0.875rem;
  font-weight: 300;
}

.drone-selection-image-wrapper {
  width: 100%;
  height: 16rem;
  position: relative;
  background-color: rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

@media (min-width: 768px) {
  .drone-selection-image-wrapper {
    width: 40%;
    height: auto;
  }
}

.drone-selection-image {
  height: 100%;
  width: 100%;
  object-fit: cover;
  mix-blend-mode: overlay;
  opacity: 0.8;
  transition: transform 1s;
}

.drone-selection-card:hover .drone-selection-image {
  transform: scale(1.1);
}

.drone-selection-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, transparent, rgba(36, 58, 71, 0.4));
}

.drone-selection-content {
  width: 100%;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
  position: relative;
}

@media (min-width: 768px) {
  .drone-selection-content {
    width: 60%;
  }
}

.drone-selection-badge-text {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.75rem;
  font-weight: 900;
  color: rgba(25, 127, 230, 0.3);
  transition: color var(--transition-base);
}

.drone-selection-card:hover .drone-selection-badge-text {
  color: var(--color-primary);
}

.drone-selection-info {
  flex: 1;
}

.drone-selection-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.drone-selection-name {
  font-size: 1.875rem;
  font-weight: 900;
  letter-spacing: -0.025em;
  margin: 0;
}

.drone-selection-price {
  text-align: right;
}

.drone-price {
  font-size: 1.875rem;
  font-weight: 900;
  color: var(--color-primary);
  margin: 0;
}

.drone-price-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}

.drone-selection-description {
  font-size: 1rem;
  color: var(--color-text-secondary);
  line-height: 1.75;
  margin: 0;
}

.drone-selection-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.drone-stat-badge {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-xl);
  background-color: rgba(17, 26, 34, 0.8);
  font-size: 0.6875rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

.drone-selection-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
}

.drone-select-button {
  flex: 1;
  background-color: var(--color-primary);
  color: var(--color-white);
  font-weight: 900;
  padding: 1rem 1.5rem;
  border-radius: var(--radius-2xl);
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: 0 20px 25px -5px rgba(25, 127, 230, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.drone-select-button:hover {
  background-color: #1566c4;
}

.drone-select-button:active {
  transform: scale(0.95);
}

.drone-select-icon {
  font-size: 1.25rem;
  transition: transform var(--transition-base);
}

.drone-select-button:hover .drone-select-icon {
  transform: rotate(12deg);
}

.drone-info-button {
  padding: 1rem;
  border-radius: var(--radius-2xl);
  border: 2px solid var(--color-slate-600);
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-base);
}

.drone-info-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.drone-info-button .material-symbols-outlined {
  font-size: 1.5rem;
  font-weight: 300;
}

.alternatives-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;
  padding: 1.25rem 2rem;
  border-radius: var(--radius-2xl);
  background-color: rgba(36, 58, 71, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-lg);
}

.alternatives-button:hover {
  background-color: var(--color-surface-highlight);
}

.alternatives-text {
  font-size: 0.875rem;
  font-weight: 900;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color var(--transition-base);
}

.alternatives-button:hover .alternatives-text {
  color: var(--color-white);
}

.alternatives-icon {
  color: var(--color-text-secondary);
  transition: all var(--transition-base);
}

.alternatives-button:hover .alternatives-icon {
  transform: translateY(0.25rem);
}

.alternatives-icon-expanded {
  transform: rotate(180deg);
}

.alternatives-button:hover .alternatives-icon-expanded {
  transform: rotate(180deg) translateY(0.25rem);
}

.billing-placeholder {
  padding: 2.5rem;
  border-radius: 2rem;
  background-color: rgba(36, 58, 71, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

.billing-locked {
  height: 8rem;
  background-color: rgba(30, 41, 59, 0.5);
  border-radius: var(--radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
}

.billing-locked-text {
  color: var(--color-slate-600);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.3em;
}

.booking-sidebar {
  position: relative;
}

@media (min-width: 1024px) {
  .booking-sidebar {
    grid-column: span 4;
  }
}

.summary-card {
  position: sticky;
  top: 7rem;
  background-color: var(--color-surface-highlight);
  border-radius: 2.5rem;
  padding: 2.5rem;
  box-shadow: var(--shadow-2xl);
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.summary-header-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0.5rem;
  background-color: var(--color-primary);
}

.summary-title {
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0;
}

.summary-icon-wrapper {
  padding: 0.75rem;
  border-radius: var(--radius-2xl);
  background-color: rgba(25, 127, 230, 0.1);
}

.summary-icon {
  color: var(--color-primary);
  font-size: 1.875rem;
  font-weight: 300;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-item-label {
  color: var(--color-text-secondary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.summary-item-label .material-symbols-outlined {
  font-size: 0.875rem;
}

.summary-item-value {
  font-weight: 700;
  font-size: 1.125rem;
}

.summary-item-discount {
  color: var(--color-primary);
}

.summary-item-discount .summary-item-value {
  font-weight: 900;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
}

.summary-total-label {
  display: flex;
  flex-direction: column;
}

.summary-total-text {
  font-size: 0.625rem;
  color: var(--color-text-secondary);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.summary-total-currency {
  font-size: 0.75rem;
  color: var(--color-primary);
  font-weight: 700;
}

.summary-total-amount {
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: -0.025em;
  color: var(--color-white);
}

.summary-button {
  width: 100%;
  background-color: var(--color-primary);
  color: var(--color-white);
  font-weight: 900;
  padding: 1.25rem;
  border-radius: 1.5rem;
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: 0 25px 50px -12px rgba(25, 127, 230, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
}

.summary-button:hover {
  background-color: #1566c4;
  transform: scale(1.05);
}

.summary-button:active {
  transform: scale(0.95);
}

.summary-button-icon {
  font-size: 1.5rem;
  font-weight: 300;
}

.summary-security {
  text-align: center;
  font-size: 0.625rem;
  color: var(--color-text-secondary);
  margin-top: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0;
}

.operator-card {
  background-color: rgba(36, 58, 71, 0.3);
  backdrop-filter: blur(12px);
  border-radius: 2rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-xl);
}

.operator-card:hover {
  border-color: rgba(25, 127, 230, 0.3);
}

.operator-avatar-wrapper {
  position: relative;
}

.operator-avatar {
  width: 4rem;
  height: 4rem;
  border-radius: var(--radius-2xl);
  object-fit: cover;
  box-shadow: var(--shadow-lg);
  transition: transform 0.5s;
}

.operator-card:hover .operator-avatar {
  transform: scale(1.1);
}

.operator-status {
  position: absolute;
  bottom: -0.25rem;
  right: -0.25rem;
  width: 1.25rem;
  height: 1.25rem;
  background-color: #10b981;
  border-radius: 9999px;
  border: 4px solid var(--color-background-dark);
}

.operator-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.operator-name {
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: -0.025em;
}

.operator-details {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.operator-role {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-weight: 700;
}

.operator-rating {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  color: #eab308;
}

.operator-star {
  font-size: 0.75rem;
  fill: 1;
}

.operator-rating-value {
  font-size: 0.625rem;
  font-weight: 900;
}

.operator-arrow {
  margin-left: auto;
  color: var(--color-text-secondary);
  transition: color var(--transition-base);
}

.operator-card:hover .operator-arrow {
  color: var(--color-primary);
}
</style>
