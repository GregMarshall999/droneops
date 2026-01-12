import apiClient from '../axios';

export interface ContactFormData {
  name: string;
  company?: string;
  email: string;
  projectType: string;
  projectDate?: string;
  location?: string;
  description: string;
}

export interface ContactResponse {
  id: string;
  status: 'received' | 'in_review' | 'responded';
  message: string;
  estimatedResponseTime?: string;
}

/**
 * Submit contact form
 */
export const submitContactForm = async (formData: ContactFormData): Promise<ContactResponse> => {
  const response = await apiClient.post<ContactResponse>('/contact', formData);
  return response.data;
};

/**
 * Get contact inquiry by ID
 */
export const getContactInquiry = async (inquiryId: string): Promise<ContactResponse> => {
  const response = await apiClient.get<ContactResponse>(`/contact/${inquiryId}`);
  return response.data;
};

/**
 * Get all contact inquiries for current user
 */
export const getUserInquiries = async (): Promise<ContactResponse[]> => {
  const response = await apiClient.get<ContactResponse[]>('/contact');
  return response.data;
};
