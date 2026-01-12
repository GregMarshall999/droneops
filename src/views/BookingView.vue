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
  <div class="animate-in fade-in duration-700 bg-background-dark min-h-screen text-white py-12 px-4 md:px-10 lg:px-20">
    <div class="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
      
      <!-- Left Column: Mission Builder -->
      <div class="lg:col-span-8 flex flex-col gap-12">
        
        <!-- Header & Progress -->
        <div class="flex flex-col gap-8">
          <div class="flex flex-col gap-3">
            <h1 class="text-5xl font-black tracking-tight leading-tight">New Mission Request</h1>
            <p class="text-text-secondary text-lg">Configure your drone operation requirements below.</p>
          </div>
          
          <div class="flex flex-col gap-5 pt-4">
            <div class="flex justify-between items-end">
              <p class="text-lg font-bold text-primary">Configuration in progress</p>
              <p class="text-sm font-black text-text-secondary uppercase tracking-widest">Step 3 of 5</p>
            </div>
            <div class="rounded-full h-2.5 bg-surface-highlight overflow-hidden">
              <div class="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(25,127,230,0.5)] transition-all duration-1000" style="width: 60%"></div>
            </div>
            <div class="flex justify-between text-[11px] font-black text-text-secondary uppercase tracking-[0.2em]">
              <span class="text-green-500">Profile</span>
              <span class="text-green-500">Location</span>
              <span class="text-primary border-b-2 border-primary pb-1">Equipment</span>
              <span>Billing</span>
            </div>
          </div>
        </div>

        <!-- Step 1: Profile -->
        <section class="flex flex-col gap-6">
          <div class="flex items-center gap-4 pb-4 border-b border-surface-highlight">
            <span class="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary font-black text-lg shadow-inner">1</span>
            <h2 class="text-2xl font-bold tracking-tight">Mission Profile</h2>
            <span class="material-symbols-outlined text-green-500 ml-auto text-3xl">check_circle</span>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div 
              v-for="(p, i) in profiles" 
              :key="i" 
              @click="selectProfile(p)"
              :class="`group relative cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-300 ${p.active ? 'border-primary ring-4 ring-primary/20 scale-105 shadow-2xl shadow-primary/30' : 'border-transparent hover:border-primary/50 grayscale hover:grayscale-0'}`"
            >
              <div v-if="p.active" class="absolute top-3 right-3 z-20 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg animate-pulse">Selected</div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
              <img class="h-40 w-full object-cover group-hover:scale-110 transition-transform duration-700" :src="p.img" :alt="p.label" />
              <p class="absolute bottom-4 left-4 z-20 font-black text-white text-base tracking-tight">{{ p.label }}</p>
            </div>
          </div>
        </section>

        <!-- Step 2: Location -->
        <section class="flex flex-col gap-6">
          <div class="flex items-center gap-4 pb-4 border-b border-surface-highlight">
            <span class="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary font-black text-lg shadow-inner">2</span>
            <h2 class="text-2xl font-bold tracking-tight">Flight Zone & Schedule</h2>
            <span class="material-symbols-outlined text-green-500 ml-auto text-3xl">check_circle</span>
          </div>
          <div class="grid md:grid-cols-2 gap-10">
            <div class="flex flex-col gap-6">
              <div class="flex flex-col gap-3">
                <label class="text-xs font-black text-text-secondary uppercase tracking-widest">Target Location</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-2xl font-light">search</span>
                  <input 
                    v-model="bookingStore.location"
                    class="w-full bg-surface-highlight/50 border-none rounded-2xl py-4 pl-12 pr-5 text-base font-medium focus:ring-4 focus:ring-primary/20 text-white placeholder-slate-500 shadow-inner" 
                    type="text" 
                  />
                </div>
              </div>
              <div class="relative h-48 w-full rounded-2xl overflow-hidden group shadow-2xl">
                <div class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <span class="material-symbols-outlined text-5xl text-primary drop-shadow-2xl animate-bounce">location_on</span>
                </div>
                <img class="h-full w-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLxjNCNxIp8Zr2CGxtzTMeEkDbWe2yd2kvpWoNtCj7KIKBrVvdyVqjkLD5tpOcEZ7kFU8mQ_60O8CQ4zDDPGKHXzqJ0jKadTWffYTTgFZ2R7km1tfJpM1UuNA-nFxxxQZe_yLTZC4h3Dc7ejsIX52n-bxAypKaOzkaXJvlV69ppJuNtKohKYA1E8cu4q8bgTqS0VCBv6YTV_ZJoE7LiSlOklNFP78lWZNpPMN-EbyHgXTuWIaPd_88OfSoJW5Cs01qFKiFHOszMo0P" alt="Map View" />
              </div>
            </div>
            
            <div class="flex flex-col gap-6">
              <div class="flex flex-col gap-3">
                <label class="text-xs font-black text-text-secondary uppercase tracking-widest">Mission Date</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-2xl font-light">calendar_month</span>
                  <input 
                    v-model="bookingStore.missionDate"
                    class="w-full bg-surface-highlight/50 border-none rounded-2xl py-4 pl-12 pr-5 text-base font-medium focus:ring-4 focus:ring-primary/20 text-white shadow-inner [color-scheme:dark]" 
                    type="date" 
                  />
                </div>
              </div>
              <div class="flex flex-col gap-3">
                <label class="text-xs font-black text-text-secondary uppercase tracking-widest">Start Time</label>
                <div class="grid grid-cols-3 gap-3">
                  <button 
                    v-for="time in timeSlots" 
                    :key="time"
                    @click="selectTime(time)"
                    :class="`py-3 px-2 text-sm font-bold rounded-xl transition-all shadow-lg ${time === bookingStore.startTime ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-surface-highlight text-text-secondary hover:bg-[#324a61]'}`"
                  >
                    {{ time }}
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-3 text-sm text-text-secondary mt-2 bg-primary/5 p-3 rounded-xl border border-primary/10">
                <span class="material-symbols-outlined text-primary text-xl">cloud_done</span>
                <span>Forecast: Clear Sky (72°F)</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Step 3: Equipment -->
        <section class="flex flex-col gap-8">
          <div class="flex items-center gap-4 pb-4 border-b border-surface-highlight">
            <span class="flex items-center justify-center size-10 rounded-full bg-primary text-white font-black text-lg shadow-lg">3</span>
            <h2 class="text-2xl font-bold tracking-tight">Drone Selection</h2>
          </div>
          
          <div class="relative flex flex-col md:flex-row bg-surface-highlight/40 rounded-[2rem] overflow-hidden border border-primary/40 shadow-2xl group hover:border-primary transition-all duration-500">
            <div class="absolute top-0 left-0 bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-br-2xl z-20 flex items-center gap-2 uppercase tracking-widest shadow-xl">
              <span class="material-symbols-outlined text-sm font-light">auto_awesome</span> AI Recommended
            </div>
            <div class="md:w-2/5 h-64 md:h-auto relative bg-black/40 overflow-hidden">
              <img class="h-full w-full object-cover mix-blend-overlay opacity-80 group-hover:scale-110 transition-transform duration-1000" :src="bookingStore.selectedDrone.imageUrl" :alt="bookingStore.selectedDrone.name" />
              <div class="absolute inset-0 bg-gradient-to-r from-transparent to-surface-highlight/40"></div>
            </div>
            <div class="md:w-3/5 p-10 flex flex-col justify-between gap-6 relative">
              <div class="absolute top-4 right-4 text-xs font-black text-primary/30 group-hover:text-primary transition-colors">BEST PERFORMANCE</div>
              <div>
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-3xl font-black tracking-tight">{{ bookingStore.selectedDrone.name }}</h3>
                  <div class="text-right">
                    <p class="text-3xl font-black text-primary">${{ bookingStore.selectedDrone.price }}</p>
                    <p class="text-xs font-bold text-text-secondary uppercase tracking-widest">per day</p>
                  </div>
                </div>
                <p class="text-base text-text-secondary leading-relaxed">Perfect for cinematic wedding shots with 5.1K Apple ProRes recording and omnidirectional obstacle sensing.</p>
              </div>
              <div class="flex flex-wrap gap-3">
                <span 
                  v-for="(s, i) in bookingStore.selectedDrone.stats" 
                  :key="i" 
                  class="px-4 py-2 rounded-xl bg-background-dark/80 text-[11px] font-black uppercase tracking-wider text-text-secondary border border-white/5 shadow-inner"
                >
                  {{ s.value }} {{ s.label }}
                </span>
              </div>
              <div class="flex items-center gap-4 pt-4">
                <button class="flex-1 bg-primary hover:bg-blue-600 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 group/sel">
                  Selected
                  <span class="material-symbols-outlined text-xl group-hover/sel:rotate-12 transition-transform">check_circle</span>
                </button>
                <button class="p-4 rounded-2xl border-2 border-slate-600 hover:bg-white/10 transition-all text-text-secondary">
                  <span class="material-symbols-outlined text-2xl font-light">info</span>
                </button>
              </div>
            </div>
          </div>

          <button class="flex items-center justify-between w-full text-left px-8 py-5 rounded-2xl bg-surface-highlight/30 hover:bg-surface-highlight transition-all border border-white/5 group shadow-lg">
            <span class="text-sm font-black text-text-secondary uppercase tracking-widest group-hover:text-white transition-colors">View 2 Alternative Drones</span>
            <span class="material-symbols-outlined text-text-secondary group-hover:translate-y-1 transition-all">expand_more</span>
          </button>
        </section>

        <!-- Step 4: Billing Preview -->
        <section class="flex flex-col gap-8 opacity-40 grayscale pointer-events-none">
          <div class="flex items-center gap-4 pb-4 border-b border-surface-highlight">
            <span class="flex items-center justify-center size-10 rounded-full border-2 border-slate-600 text-text-secondary font-black text-lg">4</span>
            <h2 class="text-2xl font-bold tracking-tight text-text-secondary">Secure Payment</h2>
          </div>
          <div class="p-10 rounded-[2rem] bg-surface-highlight/20 border border-white/5 shadow-inner">
             <div class="h-32 bg-slate-800/50 rounded-2xl flex items-center justify-center">
               <span class="text-slate-600 font-black uppercase tracking-[0.3em]">Module Locked</span>
             </div>
          </div>
        </section>
      </div>

      <!-- Right Column: Sticky Summary -->
      <div class="lg:col-span-4 relative">
        <div class="sticky top-28 flex flex-col gap-8">
          <div class="bg-surface-highlight rounded-[2.5rem] p-10 shadow-2xl border border-white/5 relative overflow-hidden group">
            <div class="absolute top-0 left-0 w-full h-2 bg-primary"></div>
            <h3 class="text-2xl font-black mb-10 flex items-center gap-4">
              <div class="p-3 rounded-2xl bg-primary/10">
                <span class="material-symbols-outlined text-primary text-3xl font-light">receipt_long</span>
              </div>
              Mission Estimate
            </h3>
            
            <div class="flex flex-col gap-6 mb-10 border-b border-white/10 pb-8">
              <div class="flex justify-between items-center">
                <span class="text-text-secondary font-medium">Operator Fee (4h)</span>
                <span class="font-bold text-lg">$320.00</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-text-secondary font-medium">Equipment Rental</span>
                <span class="font-bold text-lg">${{ bookingStore.selectedDrone.price?.toFixed(2) || '0.00' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-text-secondary font-medium">Insurance</span>
                <span class="font-bold text-lg">$85.00</span>
              </div>
              <div class="flex justify-between items-center text-primary">
                <span class="font-bold flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">confirmation_number</span>
                  Platform Discount
                </span>
                <span class="font-black text-lg">-$50.00</span>
              </div>
            </div>

            <div class="flex justify-between items-end mb-10">
              <div class="flex flex-col">
                <span class="text-[10px] text-text-secondary font-black uppercase tracking-[0.2em]">Total Cost</span>
                <span class="text-xs text-primary font-bold">USD (Estimated)</span>
              </div>
              <span class="text-5xl font-black tracking-tight text-white">${{ bookingStore.totalCost.toFixed(2) }}</span>
            </div>

            <button class="w-full bg-primary hover:bg-blue-600 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 flex justify-center items-center gap-3">
              Pay & Reserve Operator
              <span class="material-symbols-outlined text-2xl font-light">arrow_forward</span>
            </button>
            
            <p class="text-center text-[10px] text-text-secondary mt-6 font-bold uppercase tracking-widest">
              Protected by 256-bit SSL encryption
            </p>
          </div>

          <!-- Operator Card -->
          <div class="bg-surface-highlight/30 backdrop-blur-md rounded-[2rem] p-6 flex items-center gap-5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group shadow-xl">
            <div class="relative">
              <img class="size-16 rounded-2xl object-cover shadow-lg group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8LSI_BSq-qiFSeRdTgjvPDSeuOkR56rJ_QZskcT8M2Pe5f7JtRExRnrZUcPOxwu3GT476adSZ8j262sr496l9EpjPj8LRrvgyjZQwCZIsstum0lXukjE0wxLpMG8W8_cXVXIRuiH-fR3FmDLUMcK3Gi89f12EVpdQCtJJGckD3CfIR4woPSmEB526vrzP12yXwBDRI2alxTVKUJPtwnplaFRPYW4x9NzIGS6hl6VImeH3DiF7YM-df4f31rYmFdI9kOhE4qOl5rA4" alt="Operator" />
              <div class="absolute -bottom-1 -right-1 size-5 bg-green-500 rounded-full border-4 border-background-dark"></div>
            </div>
            <div class="flex flex-col">
              <span class="text-base font-black tracking-tight">Alex M.</span>
              <div class="flex items-center gap-1.5">
                <span class="text-xs text-text-secondary font-bold">Drone Expert</span>
                <div class="flex items-center gap-0.5 text-yellow-500">
                  <span class="material-symbols-outlined text-xs fill-1">star</span>
                  <span class="text-[10px] font-black">4.9</span>
                </div>
              </div>
            </div>
            <span class="material-symbols-outlined ml-auto text-text-secondary group-hover:text-primary transition-colors">chevron_right</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
