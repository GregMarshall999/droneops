import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { FLEET } from '../constants';
import type { Drone } from '../types';

export const useBookingStore = defineStore('booking', () => {
  const selectedDrone = ref<Drone | null>(null);
  const selectedProfile = ref<string | null>(null);
  const location = ref<string>('');
  const missionDate = ref<string>('');
  const startTime = ref<string>('');
  const currentStep = ref<number>(3);

  const setSelectedDrone = (drone: Drone) => {
    selectedDrone.value = drone;
  };

  const setSelectedProfile = (profile: string) => {
    selectedProfile.value = profile;
  };

  const setLocation = (loc: string) => {
    location.value = loc;
  };

  const setMissionDate = (date: string) => {
    missionDate.value = date;
  };

  const setStartTime = (time: string) => {
    startTime.value = time;
  };

  const setCurrentStep = (step: number) => {
    currentStep.value = step;
  };

  const totalCost = computed(() => {
    const operatorFee = 320.00;
    const equipmentRental = selectedDrone.value?.price || 0;
    const insurance = 85.00;
    const discount = 50.00;
    return operatorFee + equipmentRental + insurance - discount;
  });

  return {
    selectedDrone,
    selectedProfile,
    location,
    missionDate,
    startTime,
    currentStep,
    totalCost,
    setSelectedDrone,
    setSelectedProfile,
    setLocation,
    setMissionDate,
    setStartTime,
    setCurrentStep
  };
});
