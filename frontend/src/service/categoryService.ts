import api from '../utils/axios';
import type { ApiSuccessResponse } from '../types/api';
import type { Category } from '../types/models';
import type { CreateCategoryPayload, UpdateCategoryPayload } from '../types/requests';

export const categoryService = {
  async getPublicCategories(): Promise<string[]> {
    const response = await api.get<ApiSuccessResponse<string[]>>('/api/categories/public');
    return response.data.data;
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get<ApiSuccessResponse<Category[]>>('/api/categories');
    return response.data.data;
  },

  async createCategory(payload: CreateCategoryPayload): Promise<Category> {
    const response = await api.post<ApiSuccessResponse<Category>>('/api/categories', payload);
    return response.data.data;
  },

  async updateCategory(id: string, payload: UpdateCategoryPayload): Promise<Category> {
    const response = await api.put<ApiSuccessResponse<Category>>(`/api/categories/${id}`, payload);
    return response.data.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/api/categories/${id}`);
  },
};
