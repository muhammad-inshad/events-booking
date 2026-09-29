import api from '../utils/axios';
import type { ApiSuccessResponse } from '../types/api';
import type { AdminUser } from '../types/models';
import type { ToggleUserBlockPayload, UpdateUserRolePayload } from '../types/requests';

export const adminService = {
  async getUsers(): Promise<AdminUser[]> {
    const response = await api.get<ApiSuccessResponse<AdminUser[]>>('/api/admin/users');
    return response.data.data;
  },

  async updateUserRole(userId: string, payload: UpdateUserRolePayload): Promise<AdminUser> {
    const response = await api.put<ApiSuccessResponse<AdminUser>>(`/api/admin/users/${userId}/role`, payload);
    return response.data.data;
  },

  async toggleUserBlock(userId: string, payload: ToggleUserBlockPayload): Promise<AdminUser> {
    const response = await api.put<ApiSuccessResponse<AdminUser>>(`/api/admin/users/${userId}/block`, payload);
    return response.data.data;
  },
};
