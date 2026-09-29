export type { PaginatedResult } from './pagination.dto';

export type ServiceSortOption = 'price_asc' | 'price_desc' | 'oldest' | 'newest';

export interface ServiceListQueryDTO {
  keyword?: string;
  category?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

export interface PublicServiceListQueryDTO extends ServiceListQueryDTO {
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateServiceDTO {
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
}

export type UpdateServiceDTO = Partial<CreateServiceDTO>;
