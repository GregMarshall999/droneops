import apiClient from '../axios';

export interface BookingRequest {
  profile: string;
  location: string;
  missionDate: string;
  startTime: string;
  droneId: string;
  operatorId?: string;
}

export interface BookingResponse {
  id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalCost: number;
  estimatedCompletionDate?: string;
  operator?: {
    id: string;
    name: string;
    rating: number;
  };
}

export interface QuoteRequest {
  profile: string;
  location: string;
  missionDate: string;
  startTime: string;
  droneId: string;
  duration?: number; // in hours
}

export interface QuoteResponse {
  operatorFee: number;
  equipmentRental: number;
  insurance: number;
  discount: number;
  totalCost: number;
  currency: string;
}

/**
 * Create a new booking
 */
export const createBooking = async (bookingData: BookingRequest): Promise<BookingResponse> => {
  const response = await apiClient.post<BookingResponse>('/bookings', bookingData);
  return response.data;
};

/**
 * Get a quote for a booking
 */
export const getQuote = async (quoteData: QuoteRequest): Promise<QuoteResponse> => {
  const response = await apiClient.post<QuoteResponse>('/bookings/quote', quoteData);
  return response.data;
};

/**
 * Get booking by ID
 */
export const getBooking = async (bookingId: string): Promise<BookingResponse> => {
  const response = await apiClient.get<BookingResponse>(`/bookings/${bookingId}`);
  return response.data;
};

/**
 * Get all bookings for current user
 */
export const getUserBookings = async (): Promise<BookingResponse[]> => {
  const response = await apiClient.get<BookingResponse[]>('/bookings');
  return response.data;
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (bookingId: string): Promise<void> => {
  await apiClient.delete(`/bookings/${bookingId}`);
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (
  bookingId: string,
  status: BookingResponse['status']
): Promise<BookingResponse> => {
  const response = await apiClient.patch<BookingResponse>(`/bookings/${bookingId}/status`, { status });
  return response.data;
};
