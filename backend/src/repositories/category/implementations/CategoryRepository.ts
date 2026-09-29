import { BaseRepository } from '../../base/implementations/BaseRepository';
import { ICategoryRepository } from '../interfaces/ICategoryRepository';
import { Category, ICategory } from '../../../models/Category';
import { escapeRegex } from '../../../utils/regex';

export class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepository {
  constructor() {
    super(Category);
  }

  async findByAdmin(adminId: string): Promise<ICategory[]> {
    return await this._model.find({ adminId }).sort({ createdAt: -1 }).exec();
  }

  async findByNameForAdmin(adminId: string, name: string): Promise<ICategory | null> {
    return await this._model
      .findOne({ adminId, name: { $regex: new RegExp(`^${escapeRegex(name)}$`, 'i') } })
      .exec();
  }

  async updateForAdmin(id: string, adminId: string, data: Partial<ICategory>): Promise<ICategory | null> {
    return await this._model
      .findOneAndUpdate({ _id: id, adminId }, data, { new: true, runValidators: true })
      .exec();
  }

  async deleteForAdmin(id: string, adminId: string): Promise<ICategory | null> {
    return await this._model.findOneAndDelete({ _id: id, adminId }).exec();
  }

  async findDistinctNames(): Promise<string[]> {
    return await this._model.distinct('name').exec();
  }
}
