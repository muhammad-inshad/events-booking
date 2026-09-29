import api from '../utils/axios';
import type { ApiSuccessResponse, PaginatedApiResponse } from '../types/api';
import type { Booking, DashboardStatPoint, Paginated } from '../types/models';
import type { CreateBookingPayload, ProviderBookingListParams } from '../types/requests';

export const bookingService = {
  async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    const response = await api.post<ApiSuccessResponse<Booking>>('/api/user/bookings', payload);
    return response.data.data;
  },

  async getMyBookings(): Promise<Booking[]> {
    const response = await api.get<ApiSuccessResponse<Booking[]>>('/api/user/bookings');
    return response.data.data;
  },

  async getProviderBookings(params: ProviderBookingListParams): Promise<Paginated<Booking>> {
    const response = await api.get<PaginatedApiResponse<Booking>>('/api/services/bookings', { params });
    return { data: response.data.data, pagination: response.data.pagination };
  },

  async getDashboardStats(): Promise<DashboardStatPoint[]> {
    const response = await api.get<ApiSuccessResponse<DashboardStatPoint[]>>('/api/services/dashboard-stats');
    return response.data.data;
  },
};
