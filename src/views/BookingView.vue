<script setup lang="ts">
import { ref } from 'vue';
import { useBookingStore } from '../stores/booking';
import { FLEET } from '../constants';

const bookingStore = useBookingStore();

const profiles = ref([
  { label: 'Real Estate', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqHDSL1oR_Pt2CeucE6eNBKkf298PyYkVLk1to-jZEyenfAQ02pnte_SHHRE3K_o7tesckZUtyxXx9NiV3_WQGi-6SDIinOl0uX1UMLICMdf6cX8P9mAWNe03HGBOGaUcZHRdjbhDcdL2HAXt90elEvaoItNGI25Ku_NaDjpjd_OevWtRusjM6vnFul1C0EhTIIaR5OfVtSkMeIrrhxa7CczKM3xRclru1nI6Z2Hk2JdX1JOj-OZiUlJzX-8t9lJZ0-mXRlZEL75Vf', active: false },
  { label: 'Wedding & Events', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcKdxBw3GKgBaLtrn0gXPvp2P4pozeXvrJ8DUT7qH5JnafJLV9rx5ISmMTu4gYCYzhSOqfQ8otzD40x0Cw2H6TnytnAG3xMfKyTVylrM6awwFCOHlETD6_AqsupDG80WkgAQKFKtLc-S-Gpan3mujxjKOowhjW6slxGHSbw8Kln7CZ3TmEZ8ICUnVWl2Z1LRlUsjM3N4EuwdvfA1t5znd89L-8gI2ndpoGmKHFLpzbhG8_poWG6EUI573qBwrpEyd0vbWqMVZYN7pU', active: true },
  { label: 'Industrial Survey', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnFiSx3dwEDvogC5IUsH-YdACwhFkFtOx9zm_dZFYF8ExNeiGg0mEFRhNKdGN19wVMJbF_Af_KSInV20nBWeDsQ1W4tcDjv-sHJKhnrVlfJULVEP96azLiW8fCVJczW2zY3Btx2qiCjLaJz6QtLekUteaRv6P2yYXCE05aNG-U48mzo-rtao3vsdvhhE8erOxeOemUs_faauQe2n4IMnGNHudZwn_-gr58YS2PGXGgoU9arLxNVXemXeIotT6Rj4PYWiQNMv0r9l6C', active: false }
]);

const timeSlots = ['09:00 AM', '01:00 PM', '04:00 PM'];

const selectProfile = (profile: typeof profiles.value[0]) => {
  bookingStore.setSelectedProfile(profile.label);
  profiles.value.forEach(p => p.active = p.label === profile.label);
};

const selectTime = (time: string) => {
  bookingStore.setStartTime(time);
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
            <h1 class="booking-title">New Mission Request</h1>
            <p class="booking-subtitle">Configure your drone operation requirements below.</p>
          </div>
          
          <div class="progress-section">
            <div class="progress-header">
              <p class="progress-status">Configuration in progress</p>
              <p class="progress-step">Step 3 of 5</p>
            </div>
            <div class="progress-bar">
              <div class="progress-bar-fill" style="width: 60%"></div>
            </div>
            <div class="progress-steps">
              <span class="progress-step-item progress-step-complete">Profile</span>
              <span class="progress-step-item progress-step-complete">Location</span>
              <span class="progress-step-item progress-step-active">Equipment</span>
              <span class="progress-step-item">Billing</span>
            </div>
          </div>
        </div>

        <!-- Step 1: Profile -->
        <section class="booking-step">
          <div class="step-header">
            <span class="step-number step-number-complete">1</span>
            <h2 class="step-title">Mission Profile</h2>
            <span class="material-symbols-outlined step-check">check_circle</span>
          </div>
          <div class="profile-grid">
            <div 
              v-for="(p, i) in profiles" 
              :key="i" 
              @click="selectProfile(p)"
              :class="['profile-card', { 'profile-card-active': p.active }]"
            >
              <div v-if="p.active" class="profile-badge">Selected</div>
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
            <h2 class="step-title">Flight Zone & Schedule</h2>
            <span class="material-symbols-outlined step-check">check_circle</span>
          </div>
          <div class="location-grid">
            <div class="location-section">
              <div class="form-group">
                <label class="form-label">Target Location</label>
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
                <div class="map-overlay">
                  <span class="material-symbols-outlined map-icon">location_on</span>
                </div>
                <img class="map-image" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLxjNCNxIp8Zr2CGxtzTMeEkDbWe2yd2kvpWoNtCj7KIKBrVvdyVqjkLD5tpOcEZ7kFU8mQ_60O8CQ4zDDPGKHXzqJ0jKadTWffYTTgFZ2R7km1tfJpM1UuNA-nFxxxQZe_yLTZC4h3Dc7ejsIX52n-bxAypKaOzkaXJvlV69ppJuNtKohKYA1E8cu4q8bgTqS0VCBv6YTV_ZJoE7LiSlOklNFP78lWZNpPMN-EbyHgXTuWIaPd_88OfSoJW5Cs01qFKiFHOszMo0P" alt="Map View" />
              </div>
            </div>
            
            <div class="schedule-section">
              <div class="form-group">
                <label class="form-label">Mission Date</label>
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
                <label class="form-label">Start Time</label>
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
              <div class="weather-info">
                <span class="material-symbols-outlined weather-icon">cloud_done</span>
                <span>Forecast: Clear Sky (72°F)</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Step 3: Equipment -->
        <section class="booking-step">
          <div class="step-header">
            <span class="step-number step-number-active">3</span>
            <h2 class="step-title">Drone Selection</h2>
          </div>
          
          <div class="drone-selection-card">
            <div class="drone-selection-badge">
              <span class="material-symbols-outlined">auto_awesome</span> AI Recommended
            </div>
            <div class="drone-selection-image-wrapper">
              <img class="drone-selection-image" :src="bookingStore.selectedDrone.imageUrl" :alt="bookingStore.selectedDrone.name" />
              <div class="drone-selection-gradient"></div>
            </div>
            <div class="drone-selection-content">
              <div class="drone-selection-badge-text">BEST PERFORMANCE</div>
              <div class="drone-selection-info">
                <div class="drone-selection-header">
                  <h3 class="drone-selection-name">{{ bookingStore.selectedDrone.name }}</h3>
                  <div class="drone-selection-price">
                    <p class="drone-price">${{ bookingStore.selectedDrone.price }}</p>
                    <p class="drone-price-label">per day</p>
                  </div>
                </div>
                <p class="drone-selection-description">Perfect for cinematic wedding shots with 5.1K Apple ProRes recording and omnidirectional obstacle sensing.</p>
              </div>
              <div class="drone-selection-stats">
                <span 
                  v-for="(s, i) in bookingStore.selectedDrone.stats" 
                  :key="i" 
                  class="drone-stat-badge"
                >
                  {{ s.value }} {{ s.label }}
                </span>
              </div>
              <div class="drone-selection-actions">
                <button class="drone-select-button">
                  Selected
                  <span class="material-symbols-outlined drone-select-icon">check_circle</span>
                </button>
                <button class="drone-info-button">
                  <span class="material-symbols-outlined">info</span>
                </button>
              </div>
            </div>
          </div>

          <button class="alternatives-button">
            <span class="alternatives-text">View 2 Alternative Drones</span>
            <span class="material-symbols-outlined alternatives-icon">expand_more</span>
          </button>
        </section>

        <!-- Step 4: Billing Preview -->
        <section class="booking-step booking-step-disabled">
          <div class="step-header">
            <span class="step-number step-number-disabled">4</span>
            <h2 class="step-title step-title-disabled">Secure Payment</h2>
          </div>
          <div class="billing-placeholder">
             <div class="billing-locked">
               <span class="billing-locked-text">Module Locked</span>
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
            Mission Estimate
          </h3>
          
          <div class="summary-items">
            <div class="summary-item">
              <span class="summary-item-label">Operator Fee (4h)</span>
              <span class="summary-item-value">$320.00</span>
            </div>
            <div class="summary-item">
              <span class="summary-item-label">Equipment Rental</span>
              <span class="summary-item-value">${{ bookingStore.selectedDrone.price?.toFixed(2) || '0.00' }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-item-label">Insurance</span>
              <span class="summary-item-value">$85.00</span>
            </div>
            <div class="summary-item summary-item-discount">
              <span class="summary-item-label">
                <span class="material-symbols-outlined">confirmation_number</span>
                Platform Discount
              </span>
              <span class="summary-item-value">-$50.00</span>
            </div>
          </div>

          <div class="summary-total">
            <div class="summary-total-label">
              <span class="summary-total-text">Total Cost</span>
              <span class="summary-total-currency">USD (Estimated)</span>
            </div>
            <span class="summary-total-amount">${{ bookingStore.totalCost.toFixed(2) }}</span>
          </div>

          <button class="summary-button">
            Pay & Reserve Operator
            <span class="material-symbols-outlined summary-button-icon">arrow_forward</span>
          </button>
          
          <p class="summary-security">
            Protected by 256-bit SSL encryption
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
              <span class="operator-role">Drone Expert</span>
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

.map-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  pointer-events: none;
}

.map-icon {
  font-size: 3rem;
  color: var(--color-primary);
  filter: drop-shadow(0 25px 50px -12px rgba(0, 0, 0, 0.25));
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-25%);
  }
}

.map-image {
  height: 100%;
  width: 100%;
  object-fit: cover;
  opacity: 0.6;
  transition: opacity 0.7s, transform 0.7s;
  transform: scale(1.1);
}

.map-container:hover .map-image {
  opacity: 1;
  transform: scale(1);
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
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

.weather-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
  background-color: rgba(25, 127, 230, 0.05);
  padding: 0.75rem;
  border-radius: var(--radius-xl);
  border: 1px solid rgba(25, 127, 230, 0.1);
}

.weather-icon {
  color: var(--color-primary);
  font-size: 1.25rem;
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
  position: relative;
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
