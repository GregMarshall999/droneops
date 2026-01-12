import apiClient from '../axios';
import type { Drone } from '../../types';

export interface DroneAvailability {
  droneId: string;
  available: boolean;
  availableDates?: string[];
  unavailableDates?: string[];
}

/**
 * Get all available drones
 */
export const getFleet = async (): Promise<Drone[]> => {
  const response = await apiClient.get<Drone[]>('/drones');
  return response.data;
};

/**
 * Get drone by ID
 */
export const getDrone = async (droneId: string): Promise<Drone> => {
  const response = await apiClient.get<Drone>(`/drones/${droneId}`);
  return response.data;
};

/**
 * Get drone availability for a date range
 */
export const getDroneAvailability = async (
  droneId: string,
  startDate: string,
  endDate: string
): Promise<DroneAvailability> => {
  const response = await apiClient.get<DroneAvailability>(
    `/drones/${droneId}/availability`,
    {
      params: { startDate, endDate }
    }
  );
  return response.data;
};

/**
 * Get recommended drone for a mission profile
 */
export const getRecommendedDrone = async (profile: string): Promise<Drone> => {
  const response = await apiClient.get<Drone>('/drones/recommended', {
    params: { profile }
  });
  return response.data;
};

/**
 * Search drones by category
 */
export const getDronesByCategory = async (category: Drone['category']): Promise<Drone[]> => {
  const response = await apiClient.get<Drone[]>('/drones', {
    params: { category }
  });
  return response.data;
};
