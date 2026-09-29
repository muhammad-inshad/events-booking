import api from '../utils/axios';
import type { ApiSuccessResponse, PaginatedApiResponse } from '../types/api';
import type { Paginated, Service } from '../types/models';
import type { ServiceListParams } from '../types/requests';

export type ServiceMutationPayload = FormData | Record<string, unknown>;

export const serviceService = {
  async getServices(params: ServiceListParams): Promise<Paginated<Service>> {
    const response = await api.get<PaginatedApiResponse<Service>>('/api/services', { params });
    return { data: response.data.data, pagination: response.data.pagination };
  },

  async createService(payload: ServiceMutationPayload): Promise<Service> {
    const response = await api.post<ApiSuccessResponse<Service>>('/api/services', payload);
    return response.data.data;
  },

  async updateService(id: string, payload: ServiceMutationPayload): Promise<Service> {
    const response = await api.put<ApiSuccessResponse<Service>>(`/api/services/${id}`, payload);
    return response.data.data;
  },

  async deleteService(id: string): Promise<void> {
    await api.delete(`/api/services/${id}`);
  },
};
