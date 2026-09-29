import api from '../utils/axios';
import type { ApiSuccessResponse } from '../types/api';
import type { AuthUser } from '../types/models';
import type { LoginPayload, RegisterPayload } from '../types/requests';

export interface AuthResult {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResult> {
    const response = await api.post<ApiSuccessResponse<AuthResult>>('/api/auth/login', payload);
    return response.data.data;
  },

  async register(payload: RegisterPayload): Promise<void> {
    await api.post('/api/auth/register', payload);
  },
};
