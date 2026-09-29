import { QueryFilter } from 'mongoose';
import { HttpStatus } from '../../../constants/httpStatus';
import { AppError } from '../../../errors/AppError';
import { IService } from '../../../models/Service';
import { IServiceRepository } from '../../../repositories/service/interfaces/IServiceRepository';
import { IImageUploadService } from '../../upload/interfaces/IImageUploadService';
import { IServiceService } from '../interfaces/IServiceService';
import { CreateServiceDTO, PaginatedResult, ServiceListQueryDTO, UpdateServiceDTO } from '../../../dto/service.dto';
import { escapeRegex } from '../../../utils/regex';

const DEFAULT_PAGE_SIZE = 5;

const resolveSortOption = (sort?: string): Record<string, 1 | -1> => {
  switch (sort) {
    case 'price_asc':
      return { pricePerDay: 1 };
    case 'price_desc':
      return { pricePerDay: -1 };
    case 'oldest':
      return { createdAt: 1 };
    default:
      return { createdAt: -1 };
  }
};

export class ServiceService implements IServiceService {
  constructor(
    private serviceRepository: IServiceRepository,
    private imageUploadService: IImageUploadService
  ) {}

  async listServices(query: ServiceListQueryDTO): Promise<PaginatedResult<IService>> {
    const { keyword, category, sort } = query;
    const filter: QueryFilter<IService> = {};

    if (keyword) {
      filter.title = { $regex: escapeRegex(keyword), $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }

    const page = parseInt(query.page ?? '1', 10) || 1;
    const limit = parseInt(query.limit ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * limit;
    const sortOption = resolveSortOption(sort);

    const [total, services] = await Promise.all([
      this.serviceRepository.countByFilter(filter),
      this.serviceRepository.findByFilter({ filter, sort: sortOption, skip, limit }),
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

  async createService(adminId: string, dto: CreateServiceDTO, imageBuffer?: Buffer): Promise<IService> {
    const imageUrl = imageBuffer ? await this.imageUploadService.upload(imageBuffer) : undefined;

    return await this.serviceRepository.create({
      ...dto,
      adminId,
      ...(imageUrl ? { imageUrl } : {}),
    } as unknown as Partial<IService>);
  }

  async updateService(id: string, adminId: string, dto: UpdateServiceDTO, imageBuffer?: Buffer): Promise<IService> {
    const imageUrl = imageBuffer ? await this.imageUploadService.upload(imageBuffer) : undefined;

    const service = await this.serviceRepository.updateScopedToAdmin(id, adminId, {
      ...dto,
      ...(imageUrl ? { imageUrl } : {}),
    } as unknown as Partial<IService>);

    if (!service) {
      throw new AppError('Service not found or unauthorized', HttpStatus.NOT_FOUND);
    }

    return service;
  }

  async deleteService(id: string, adminId: string): Promise<void> {
    const service = await this.serviceRepository.deleteScopedToAdmin(id, adminId);
    if (!service) {
      throw new AppError('Service not found or unauthorized', HttpStatus.NOT_FOUND);
    }
  }
}
