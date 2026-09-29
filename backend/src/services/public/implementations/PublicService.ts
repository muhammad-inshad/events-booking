import { QueryFilter } from 'mongoose';
import { HttpStatus } from '../../../constants/httpStatus';
import { AppError } from '../../../errors/AppError';
import { IService } from '../../../models/Service';
import { IServiceRepository } from '../../../repositories/service/interfaces/IServiceRepository';
import { IBookingRepository } from '../../../repositories/booking/interfaces/IBookingRepository';
import { IPublicService } from '../interfaces/IPublicService';
import { PublicServiceListQueryDTO } from '../../../dto/service.dto';
import { PaginatedResult } from '../../../dto/pagination.dto';
import { escapeRegex } from '../../../utils/regex';

const DEFAULT_PAGE_SIZE = 12;
const PUBLIC_EXCLUDED_FIELDS = ['adminId', 'createdAt', 'updatedAt', '__v'];

export class PublicService implements IPublicService {
  constructor(
    private serviceRepository: IServiceRepository,
    private bookingRepository: IBookingRepository
  ) {}

  async getServiceCategories(): Promise<string[]> {
    return await this.serviceRepository.findDistinctCategories();
  }

  async getPublicServices(query: PublicServiceListQueryDTO): Promise<PaginatedResult<IService>> {
    const { keyword, category, location, minPrice, maxPrice, startDate, endDate } = query;
    const filter: QueryFilter<IService> = {};

    if (keyword) {
      filter.title = { $regex: escapeRegex(keyword), $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }
    if (location) {
      filter.location = { $regex: escapeRegex(location), $options: 'i' };
    }
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const bookedServiceIds = await this.bookingRepository.findOverlappingServiceIds(start, end);
      filter._id = { $nin: bookedServiceIds };
    }

    const page = parseInt(query.page ?? '1', 10) || 1;
    const limit = parseInt(query.limit ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * limit;

    const [total, services] = await Promise.all([
      this.serviceRepository.countByFilter(filter),
      this.serviceRepository.findByFilter({
        filter,
        skip,
        limit,
        excludeFields: PUBLIC_EXCLUDED_FIELDS,
      }),
    ]);

    return {
      data: services,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit) || 1,
        totalItems: total,
      },
    };
  }

  async getPublicServiceById(id: string): Promise<IService> {
    const service = await this.serviceRepository.findByIdExcluding(id, PUBLIC_EXCLUDED_FIELDS);
    if (!service) {
      throw new AppError('Service not found', HttpStatus.NOT_FOUND);
    }
    return service;
  }
}
