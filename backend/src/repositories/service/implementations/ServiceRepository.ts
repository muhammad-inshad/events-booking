import { QueryFilter, Types } from 'mongoose';
import { BaseRepository } from '../../base/implementations/BaseRepository';
import { IServiceRepository, ServiceListOptions } from '../interfaces/IServiceRepository';
import { Service, IService } from '../../../models/Service';

export class ServiceRepository extends BaseRepository<IService> implements IServiceRepository {
  constructor() {
    super(Service);
  }

  async findByFilter(options: ServiceListOptions): Promise<IService[]> {
    const { filter, sort, skip, limit, excludeFields } = options;
    const projection = excludeFields ? excludeFields.map((field) => `-${field}`).join(' ') : undefined;

    return await this._model
      .find(filter)
      .select(projection ?? '')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findByIdExcluding(id: string, excludeFields: string[]): Promise<IService | null> {
    const projection = excludeFields.map((field) => `-${field}`).join(' ');
    return await this._model.findById(id).select(projection).exec();
  }

  async countByFilter(filter: QueryFilter<IService>): Promise<number> {
    return await this._model.countDocuments(filter).exec();
  }

  async findScopedToAdmin(id: string, adminId: string): Promise<IService | null> {
    return await this._model.findOne({ _id: id, adminId }).exec();
  }

  async updateScopedToAdmin(id: string, adminId: string, data: Partial<IService>): Promise<IService | null> {
    return await this._model
      .findOneAndUpdate({ _id: id, adminId }, data, { new: true, runValidators: true })
      .exec();
  }

  async deleteScopedToAdmin(id: string, adminId: string): Promise<IService | null> {
    return await this._model.findOneAndDelete({ _id: id, adminId }).exec();
  }

  async findIdsByAdmin(adminId: string): Promise<Types.ObjectId[]> {
    const services = await this._model.find({ adminId }).select('_id').exec();
    return services.map((service) => service._id as Types.ObjectId);
  }

  async findDistinctCategories(): Promise<string[]> {
    return await this._model.distinct('category').exec();
  }
}
