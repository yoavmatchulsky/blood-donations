export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export type Theme = 'light' | 'dark';

export interface AppState {
  user: User | null;
  theme: Theme;
  isLoading: boolean;
}

// Blood Donation API Types
export interface BloodDonationRequest {
  RequestHeader: {
    Application: number;
    Module: string;
    Function: string;
    Token: string;
  };
  RequestData: string;
}

export interface BloodDonationResponse {
  // Add specific response structure based on the actual API response
  // This is a placeholder - you may need to adjust based on actual response
  data: any;
  success: boolean;
  message?: string;
}

export interface BloodDonation {
  // Add specific blood donation properties based on the actual API response
  id?: string;
  date?: string;
  location?: string;
  type?: string;
  // Add more properties as needed
}
