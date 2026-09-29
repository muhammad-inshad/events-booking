export type UserRole = 'user' | 'event_owner' | 'admin';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  adminId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  title: string;
  category: string;
  location: string;
  lat?: number;
  lng?: number;
  pricePerDay: number;
  description: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  contactDetails: string;
  imageUrl?: string;
  adminId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingServiceRef {
  _id: string;
  title: string;
  category?: string;
  location?: string;
}

export interface BookingUserRef {
  _id: string;
  name: string;
  email: string;
}

export interface Booking {
  _id: string;
  serviceId: string | BookingServiceRef;
  userId: string | BookingUserRef;
  startDate: string;
  endDate: string;
  totalPrice: number;
  guests: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStatPoint {
  name: string;
  bookings: number;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface Paginated<T> {
  data: T[];
  pagination: PaginationMeta;
}
