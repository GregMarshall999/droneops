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
  category: 'CINEMA' | 'SPEED' | 'SURVEY';
  description: string;
  stats: {
    label: string;
    value: string;
    percentage: number;
  }[];
  price?: number;
  imageUrl: string;
}

export interface Version {
  isCompany: boolean;
}