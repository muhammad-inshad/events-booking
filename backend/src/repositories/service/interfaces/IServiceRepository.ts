import { QueryFilter, Types } from 'mongoose';
import { IBaseRepository } from '../../base/interfaces/IBaseRepository';
import { IService } from '../../../models/Service';

export interface ServiceListOptions {
  filter: QueryFilter<IService>;
  sort?: Record<string, 1 | -1>;
  skip: number;
  limit: number;
  excludeFields?: string[];
}

export interface IServiceRepository extends IBaseRepository<IService> {
  findByFilter(options: ServiceListOptions): Promise<IService[]>;
  findByIdExcluding(id: string, excludeFields: string[]): Promise<IService | null>;
  countByFilter(filter: QueryFilter<IService>): Promise<number>;
  findScopedToAdmin(id: string, adminId: string): Promise<IService | null>;
  updateScopedToAdmin(id: string, adminId: string, data: Partial<IService>): Promise<IService | null>;
  deleteScopedToAdmin(id: string, adminId: string): Promise<IService | null>;
  findIdsByAdmin(adminId: string): Promise<Types.ObjectId[]>;
  findDistinctCategories(): Promise<string[]>;
}
