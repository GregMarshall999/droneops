<script setup lang="ts">
import { ref } from 'vue';

const contactInfo = [
  { icon: 'call', label: 'Direct Line', value: '+1 (555) 012-3456' },
  { icon: 'mail', label: 'Email Inquiry', value: 'pilot@droneops.com' },
  { icon: 'location_on', label: 'Base of Ops', value: 'Portland, OR (Serving PNW)' }
];

const faqs = [
  { q: 'Do you fly in bad weather?', a: 'No. For safety and equipment integrity, we do not fly in heavy rain, snow, or high winds (above 20mph). We can reschedule for free if conditions are unsafe.' },
  { q: 'Are you licensed and insured?', a: 'Yes. All pilots hold valid FAA Part 107 certificates. We carry $1M liability insurance for all commercial operations.' },
  { q: 'What is your turnaround time?', a: 'Edited images within 24-48 hours. Video projects typically take 3-5 business days depending on complexity.' },
  { q: 'Do I need to be present?', a: 'Not always, as long as we have access and a shot list. However, being on-site is recommended for creative direction.' }
];

const projectTypes = [
  'Real Estate Photography',
  'Technical Inspection',
  'Event Coverage',
  'Cinematography',
  'Other'
];

const formData = ref({
  name: '',
  company: '',
  email: '',
  projectType: 'Real Estate Photography',
  projectDate: '',
  location: '',
  description: ''
});

const handleSubmit = () => {
  // Form submission will be handled by API service
  console.log('Form submitted:', formData.value);
};
</script>

<template>
  <div class="animate-in slide-in-from-bottom-4 duration-700 bg-background-dark min-h-screen text-white">
    <!-- Hero Section -->
    <section class="px-4 py-12 lg:px-40 lg:py-16">
      <div class="mx-auto max-w-[1000px]">
        <div 
          class="relative overflow-hidden rounded-3xl bg-cover bg-center bg-no-repeat min-h-[360px] flex flex-col items-center justify-center text-center p-12 gap-6 shadow-2xl border border-white/5"
          :style="{ backgroundImage: `linear-gradient(rgba(17, 26, 34, 0.7) 0%, rgba(17, 26, 34, 0.9) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBVYHEUUbs1tVGwVXjkSsflO4WRhnv07B_CbqC96EXXMdTtpY-TCOcUhfLoHAz2FR-FqVXrhv05bKpx2lE3lU4m4Ue1uPoYmBTEPeI0pXmW8MfMzXD3BBtZyfHswZI3wN3C-sLNxRW_N2nTQokI5W06_7inHWUSdHvIeXrbqJy-4an41_kGT71wlZHF4aD_lUE8oFPcOY4Q-nHaoSRXlam1MrxoCC3eOsksvmBafBMyJAnr4apC0zEV6virnVr23Xa2frYt64Zil4dE')` }"
        >
          <div class="flex flex-col gap-4 max-w-2xl">
            <h1 class="text-4xl lg:text-6xl font-black leading-tight tracking-tight">
              Ready to Capture the Sky? <br/><span class="text-primary">Let's Talk.</span>
            </h1>
            <p class="text-slate-400 text-lg lg:text-xl font-normal leading-relaxed">
              Fill out the form below to get a detailed quote for your next aerial imagery project.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Grid -->
    <section class="px-4 pb-24 lg:px-40">
      <div class="mx-auto max-w-[1000px] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        <!-- Left Column: Info -->
        <div class="lg:col-span-5 flex flex-col gap-10">
          <div>
            <h2 class="text-2xl font-bold leading-tight tracking-tight mb-8 flex items-center gap-3">
              <div class="w-8 h-1 bg-primary rounded-full"></div>
              Contact Information
            </h2>
            
            <div class="flex flex-col gap-5">
              <div 
                v-for="(item, i) in contactInfo" 
                :key="i" 
                class="flex items-center gap-5 p-5 rounded-2xl bg-surface-dark border border-surface-highlight/40 hover:border-primary/50 transition-all group"
              >
                <div class="flex items-center justify-center rounded-xl bg-surface-highlight text-primary shrink-0 size-14 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                  <span class="material-symbols-outlined text-2xl">{{ item.icon }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">{{ item.label }}</span>
                  <p class="text-lg font-medium truncate">{{ item.value }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Map Placeholder -->
          <div class="rounded-2xl overflow-hidden border border-surface-highlight/50 h-56 relative group shadow-2xl">
            <div class="absolute inset-0 bg-slate-900/30 group-hover:bg-transparent transition-colors z-10"></div>
            <img 
              class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 scale-110 group-hover:scale-100" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtnILhmVYX9l3HU8EvjnQ6TziVkvrSDEMMoe3KAxhg4BXoRHiUuzZy2Uu011Ew6QEOQY0Rlz9GolcVuhL3LvhTEUxr4KVZ0FaehEr5KWxxAmX7W-BmsizUwA8lk4lcFz_yyjBfKDJkGP07x--GqVnXQiGTnNQyuE_Bq0PDZVuMM7u_nPY5v7VQiA7dvQjUaSkcYDiUApj-nrSIuEV0CMoEWdbaU8kIdH1kE5ZoL2ERibOWLO8D4M3ZhVfAE_eu4xtqGbqAZMnY1DP8"
              alt="Portland Map"
            />
            <div class="absolute bottom-4 left-4 z-20 bg-surface-dark/90 backdrop-blur-md px-4 py-1.5 rounded-lg text-xs font-bold border border-white/10 shadow-lg">
              Service Radius: 100mi
            </div>
          </div>

          <div class="flex gap-4">
            <button class="flex-1 flex items-center justify-center gap-3 py-4 rounded-xl bg-surface-dark hover:bg-surface-highlight transition-all border border-surface-highlight/50 shadow-lg">
              <span class="material-symbols-outlined text-xl text-primary">photo_camera</span>
              <span class="text-sm font-bold">Instagram</span>
            </button>
            <button class="flex-1 flex items-center justify-center gap-3 py-4 rounded-xl bg-surface-dark hover:bg-surface-highlight transition-all border border-surface-highlight/50 shadow-lg">
              <span class="material-symbols-outlined text-xl text-primary">work</span>
              <span class="text-sm font-bold">LinkedIn</span>
            </button>
          </div>
        </div>

        <!-- Right Column: Form -->
        <div class="lg:col-span-7">
          <div class="bg-surface-dark rounded-[2rem] p-8 lg:p-12 border border-surface-highlight shadow-2xl relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full"></div>
            <h2 class="text-3xl font-bold mb-3 relative z-10">Request a Quote</h2>
            <p class="text-slate-400 text-base mb-10 relative z-10">Details help us fly safer and smarter. Tell us about your mission.</p>
            
            <form @submit.prevent="handleSubmit" class="flex flex-col gap-6 relative z-10">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-bold text-slate-300 uppercase tracking-widest">Your Name</label>
                  <input 
                    v-model="formData.name"
                    class="h-14 w-full rounded-xl bg-background-dark border border-surface-highlight px-5 text-base text-white placeholder-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner" 
                    placeholder="John Doe" 
                    type="text" 
                  />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-bold text-slate-300 uppercase tracking-widest">Company Name</label>
                  <input 
                    v-model="formData.company"
                    class="h-14 w-full rounded-xl bg-background-dark border border-surface-highlight px-5 text-base text-white placeholder-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner" 
                    placeholder="Sky Corp (Optional)" 
                    type="text" 
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-bold text-slate-300 uppercase tracking-widest">Email Address</label>
                  <input 
                    v-model="formData.email"
                    class="h-14 w-full rounded-xl bg-background-dark border border-surface-highlight px-5 text-base text-white placeholder-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner" 
                    placeholder="john@example.com" 
                    type="email" 
                  />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-bold text-slate-300 uppercase tracking-widest">Project Type</label>
                  <div class="relative">
                    <select 
                      v-model="formData.projectType"
                      class="h-14 w-full appearance-none rounded-xl bg-background-dark border border-surface-highlight px-5 text-base text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer shadow-inner"
                    >
                      <option v-for="type in projectTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-bold text-slate-300 uppercase tracking-widest">Project Date</label>
                  <input 
                    v-model="formData.projectDate"
                    class="h-14 w-full rounded-xl bg-background-dark border border-surface-highlight px-5 text-base text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner [color-scheme:dark]" 
                    type="date" 
                  />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-bold text-slate-300 uppercase tracking-widest">Project Location</label>
                  <div class="relative">
                    <input 
                      v-model="formData.location"
                      class="h-14 w-full rounded-xl bg-background-dark border border-surface-highlight pl-12 pr-5 text-base text-white placeholder-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner" 
                      placeholder="City or Coordinates" 
                      type="text" 
                    />
                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-xl font-light pointer-events-none">location_on</span>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-sm font-bold text-slate-300 uppercase tracking-widest">Project Description</label>
                <textarea 
                  v-model="formData.description"
                  class="h-40 w-full resize-none rounded-xl bg-background-dark border border-surface-highlight p-5 text-base text-white placeholder-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner" 
                  placeholder="Describe the shots you need, specific requirements, or hazards..."
                ></textarea>
              </div>

              <button type="submit" class="mt-4 flex h-16 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-primary hover:bg-blue-600 px-8 text-lg font-bold text-white transition-all shadow-2xl shadow-primary/30 hover:scale-[1.01] active:scale-[0.98]">
                <span class="truncate">Send Request</span>
                <span class="material-symbols-outlined text-2xl font-light">send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="px-4 pb-24 lg:px-40">
      <div class="mx-auto max-w-[1000px]">
        <h3 class="text-2xl font-bold text-white mb-10 pl-4 border-l-4 border-primary">Frequently Asked Questions</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <details 
            v-for="(faq, idx) in faqs" 
            :key="idx" 
            class="group bg-surface-dark rounded-2xl border border-surface-highlight/50 transition-all overflow-hidden shadow-lg"
          >
            <summary class="flex cursor-pointer list-none items-center justify-between p-6 font-bold text-white hover:bg-surface-highlight/30 transition-colors">
              <span class="text-lg">{{ faq.q }}</span>
              <span class="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
            </summary>
            <div class="px-6 pb-6 text-slate-400 leading-relaxed text-base">
              {{ faq.a }}
            </div>
          </details>
        </div>
      </div>
    </section>
  </div>
</template>
