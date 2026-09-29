import type { PaginationMeta } from './models';

export interface ApiSuccessResponse<T> {
  status: 'success';
  data: T;
}

export interface PaginatedApiResponse<T> {
  status: 'success';
  data: T[];
  pagination: PaginationMeta;
}
