export enum AppView {
  HOME = 'home',
  CONTACT = 'contact',
  BOOKING = 'booking'
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
}

export interface Drone {
  id: string;
  name: string;
  category: 'CINEMA' | 'SPEED' | 'SURVEY' | 'GENERAL' | 'EVENTS' | 'PHOTOGRAPHY';
  description: string;
  stats: {
    label: string;
    value: string;
    percentage: number;
  }[];
  price?: number;
  imageUrl: string;
  availableSoon?: boolean;
}

export interface Version {
  isCompany: boolean;
  hasContent: boolean;
}