import api from '../utils/axios';
import type { ApiSuccessResponse } from '../types/api';
import type { AuthUser } from '../types/models';

export const userService = {
  async getCurrentUser(): Promise<AuthUser> {
    const response = await api.get<ApiSuccessResponse<AuthUser>>('/api/user/me');
    return response.data.data;
  },
};
