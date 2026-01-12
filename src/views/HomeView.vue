<script setup lang="ts">
import { useRouter } from 'vue-router';
import { SERVICES, FLEET } from '../constants';

const router = useRouter();

const stats = [
  { icon: 'flight', label: 'Hours Flown', value: '12,500+' },
  { icon: 'assignment_turned_in', label: 'Projects', value: '950+' },
  { icon: 'shield', label: 'Safety Rating', value: '100%' },
  { icon: 'public', label: 'Countries', value: '24' }
];

const navigateToBooking = () => {
  router.push({ name: 'booking' });
};

const navigateToContact = () => {
  router.push({ name: 'contact' });
};
</script>

<template>
  <div class="animate-in fade-in duration-700">
    <!-- Hero Section -->
    <section class="relative w-full overflow-hidden bg-background-dark">
      <div class="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5 lg:py-16">
        <div class="layout-content-container flex flex-col max-w-[1200px] flex-1">
          <div class="relative flex min-h-[560px] flex-col gap-6 overflow-hidden rounded-2xl items-center justify-center p-8 text-center">
            <div 
              class="absolute inset-0 z-0 w-full h-full bg-cover bg-center transition-transform duration-1000 scale-105" 
              :style="{ 
                backgroundImage: `linear-gradient(rgba(17, 25, 33, 0.4) 0%, rgba(17, 25, 33, 0.9) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDNdc3ICjXIuZ_gSh5Kn5Qga8N-S9huscNY0KGS3r-8mA1raMKnQ8L27zXZkuXfMQMAb6ryCqgaLih3l7k_qvD7xsZPpCXa7DeYHKbSSDqFrn9o0GXolMJYJEdIgYLVBCWQ7Dj7UkgZNuuunrDGsUhke154HTPpuQBzf4jjHEgFL9lEuLB5VJQOA-BpZ_rS_4adF86ylNYSFsi2BjcGN3sybjkLxsgDr_ASBTrjO_lLyCyO3N59PCbdB9yS03R2w17l8vno4YFioAMx')` 
              }"
            ></div>
            <div class="relative z-10 flex flex-col gap-4 max-w-[850px] items-center">
              <span class="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider border border-primary/30 backdrop-blur-sm mb-4">
                Available Globally
              </span>
              <h1 class="text-white text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-[-0.033em] uppercase drop-shadow-2xl">
                Elevate Your Perspective
              </h1>
              <p class="text-slate-200 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                Professional Drone Operators on Demand. From high-speed FPV to cinematic 8K, we capture the shots others can't.
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button 
                  @click="navigateToBooking"
                  class="flex min-w-[180px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-600 hover:scale-105 transition-all shadow-xl shadow-primary/30"
                >
                  Book a Pilot
                </button>
                <button class="flex min-w-[180px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-white/10 backdrop-blur-md border border-white/20 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-white/20 transition-all">
                  <span class="material-symbols-outlined mr-2 text-xl">play_circle</span>
                  Watch Reel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="w-full bg-white dark:bg-[#111921] border-y border-slate-200 dark:border-[#243647]">
      <div class="px-4 md:px-40 flex justify-center py-12">
        <div class="max-w-[1200px] w-full">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div v-for="(stat, idx) in stats" :key="idx" class="flex flex-col gap-1 items-center md:items-start group cursor-default">
              <div class="flex items-center gap-2 text-primary mb-1 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined">{{ stat.icon }}</span>
                <p class="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">{{ stat.label }}</p>
              </div>
              <p class="text-slate-900 dark:text-white tracking-tight text-3xl md:text-4xl font-bold">{{ stat.value }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="w-full bg-slate-50 dark:bg-[#0d1218] py-24">
      <div class="px-4 md:px-10 lg:px-40 flex flex-1 justify-center">
        <div class="flex flex-col max-w-[1200px] flex-1">
          <div class="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 px-4">
            <div class="flex flex-col gap-4 max-w-[700px]">
              <span class="text-primary font-bold tracking-widest uppercase text-sm">Our Expertise</span>
              <h2 class="text-slate-900 dark:text-white text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                Specialized Aerial Solutions
              </h2>
              <p class="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                We don't just fly drones; we capture data and art. Choose the service that fits your project needs.
              </p>
            </div>
            <button class="flex items-center gap-2 text-primary font-bold hover:translate-x-1 transition-transform group">
              View All Services <span class="material-symbols-outlined text-sm group-hover:ml-1 transition-all">arrow_forward</span>
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            <div v-for="service in SERVICES" :key="service.id" class="group relative overflow-hidden rounded-2xl bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-[#243647] hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col">
              <div class="aspect-[16/10] w-full overflow-hidden">
                <div 
                  class="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                  :style="{ backgroundImage: `url('${service.imageUrl}')` }"
                ></div>
              </div>
              <div class="p-8 flex-1 flex flex-col">
                <div class="mb-4 flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <span class="material-symbols-outlined text-xl">{{ service.icon }}</span>
                  </div>
                  <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ service.title }}</h3>
                </div>
                <p class="text-slate-600 dark:text-[#93adc8] text-sm leading-relaxed mb-6">
                  {{ service.description }}
                </p>
                <button class="mt-auto text-sm font-bold text-primary flex items-center gap-1 group/btn">
                  Learn more <span class="material-symbols-outlined text-xs group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
              
            <!-- Custom Project Card -->
            <div class="group relative overflow-hidden rounded-2xl bg-primary flex flex-col justify-center items-center text-center p-10 transition-all duration-500 hover:scale-[1.02] shadow-xl shadow-primary/20">
              <div class="flex h-20 w-20 mb-6 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-4xl font-light">add</span>
              </div>
              <h3 class="text-2xl font-bold text-white mb-3">Custom Project?</h3>
              <p class="text-white/80 text-sm mb-8 max-w-[220px]">
                Have a specific vision? Our pilots are ready for any challenge.
              </p>
              <button 
                @click="navigateToContact"
                class="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors shadow-lg"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Fleet Section -->
    <section class="w-full bg-white dark:bg-[#111921] py-24 border-t border-slate-200 dark:border-[#243647]">
      <div class="px-4 md:px-10 lg:px-40 flex justify-center">
        <div class="max-w-[1200px] w-full">
          <div class="flex justify-between items-center mb-12 px-4">
            <h2 class="text-slate-900 dark:text-white text-4xl font-bold tracking-tight">Our Fleet</h2>
            <div class="flex gap-3">
              <button class="h-12 w-12 flex items-center justify-center rounded-full border border-slate-300 dark:border-[#344d65] hover:bg-primary hover:text-white hover:border-primary transition-all text-slate-600 dark:text-white">
                <span class="material-symbols-outlined">arrow_back</span>
              </button>
              <button class="h-12 w-12 flex items-center justify-center rounded-full border border-slate-300 dark:border-[#344d65] hover:bg-primary hover:text-white hover:border-primary transition-all text-slate-600 dark:text-white">
                <span class="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            <div v-for="drone in FLEET" :key="drone.id" class="group bg-slate-50 dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-[#243647] overflow-hidden flex flex-col hover:border-primary/40 transition-all duration-300 hover:shadow-xl">
              <div class="h-56 w-full p-8 flex items-center justify-center bg-slate-100 dark:bg-[#141e28] relative overflow-hidden">
                <img 
                  :alt="drone.name" 
                  class="h-full object-contain drop-shadow-2xl z-10 group-hover:scale-110 transition-transform duration-500" 
                  :src="drone.imageUrl" 
                />
                <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div class="p-8 flex-1 flex flex-col">
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ drone.name }}</h3>
                  <span class="bg-primary/20 text-primary text-[10px] font-black px-2.5 py-1 rounded-md tracking-widest">{{ drone.category }}</span>
                </div>
                <p class="text-slate-500 dark:text-[#93adc8] text-sm mb-8 leading-relaxed">
                  {{ drone.description }}
                </p>
                <div class="mt-auto space-y-5">
                  <div v-for="(stat, sIdx) in drone.stats" :key="sIdx" class="space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-slate-500 dark:text-slate-400 font-medium">{{ stat.label }}</span>
                      <span class="font-mono font-bold text-slate-900 dark:text-white">{{ stat.value }}</span>
                    </div>
                    <div class="w-full bg-slate-200 dark:bg-[#243647] h-2 rounded-full overflow-hidden">
                      <div class="bg-primary h-full rounded-full group-hover:bg-blue-400 transition-all" :style="{ width: `${stat.percentage}%` }"></div>
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
    <section class="w-full py-24 px-4">
      <div class="max-w-[1200px] mx-auto rounded-[2rem] overflow-hidden relative bg-[#111921] shadow-2xl">
        <div 
          class="absolute inset-0 opacity-40 bg-cover bg-center" 
          :style="{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBkgzl3uIauXoBkmGxdHer8zA_CB_Or6-SoBt3dgI0QRCKImeUHXwITNl7v6bFY49gi_cF68n-921rZPEr-Nb3OAQwEKRtLyNshyvzh2KUhXAGyKsk2krtWfcI0ih22xclY7kuhNWHD5L7WWHUJ0JU0C3f5Uk9Q51W5N5DGOxLOGludReUrLNA3PyRjmJFRSUSmgwLR1WsZlQY7MUDFQQW6dsr9SXW6HYCu2m-sJU8k6mFqD7uhXbjBre9z705dUhlo2vVF2cE45xtX')` }"
        ></div>
        <div class="absolute inset-0 bg-gradient-to-r from-[#111921] via-[#111921]/90 to-transparent"></div>
        <div class="relative z-10 p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12">
          <div class="max-w-xl text-center md:text-left">
            <h2 class="text-white text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to fly?</h2>
            <p class="text-slate-300 text-lg md:text-xl mb-10 leading-relaxed">
              Get a quote for your project within 24 hours. Our pilots are licensed, insured, and ready to deploy globally.
            </p>
            <div class="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
              <button 
                @click="navigateToBooking"
                class="bg-primary hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-xl shadow-primary/30 hover:scale-105"
              >
                Get a Quote
              </button>
              <button 
                @click="navigateToContact"
                class="bg-transparent border-2 border-white/30 text-white font-bold py-4 px-10 rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                Contact Sales
              </button>
            </div>
          </div>
          
          <div class="hidden lg:flex h-44 w-44 rounded-full border-2 border-primary/20 items-center justify-center animate-pulse group">
            <div class="h-32 w-32 rounded-full border-4 border-primary/40 flex items-center justify-center transition-transform group-hover:scale-110">
              <span class="material-symbols-outlined text-5xl text-primary font-light">near_me</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
