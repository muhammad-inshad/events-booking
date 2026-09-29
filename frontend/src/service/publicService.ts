import api from '../utils/axios';
import type { ApiSuccessResponse, PaginatedApiResponse } from '../types/api';
import type { Paginated, Service } from '../types/models';
import type { PublicServiceListParams } from '../types/requests';

export const publicService = {
  async getServiceCategories(): Promise<string[]> {
    const response = await api.get<ApiSuccessResponse<string[]>>('/api/public/services/categories');
    return response.data.data;
  },

  async getPublicServices(params: PublicServiceListParams): Promise<Paginated<Service>> {
    const response = await api.get<PaginatedApiResponse<Service>>('/api/public/services', { params });
    return { data: response.data.data, pagination: response.data.pagination };
  },

  async getPublicServiceById(id: string): Promise<Service> {
    const response = await api.get<ApiSuccessResponse<Service>>(`/api/public/services/${id}`);
    return response.data.data;
  },
};
