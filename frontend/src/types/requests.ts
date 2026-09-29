import type { UserRole } from './models';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface CreateCategoryPayload {
  name: string;
}

export interface UpdateCategoryPayload {
  name: string;
}

export interface ServiceListParams {
  keyword?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface PublicServiceListParams extends ServiceListParams {
  location?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateBookingPayload {
  serviceId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  guests: number;
}

export interface ProviderBookingListParams {
  page?: number;
  limit?: number;
}

export interface UpdateUserRolePayload {
  role: UserRole;
}

export interface ToggleUserBlockPayload {
  isBlocked: boolean;
}
