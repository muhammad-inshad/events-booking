import { Model, Document } from 'mongoose';
import { IBaseRepository } from '../interfaces/IBaseRepository';

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected _model: Model<T>;

  constructor(model: Model<T>) {
    this._model = model;
  }

  async create(item: Partial<T>): Promise<T> {
    const createdItem = new this._model(item);
    return await createdItem.save();
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {
    return await this._model.findByIdAndUpdate(id, item as any, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this._model.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async findById(id: string): Promise<T | null> {
    return await this._model.findById(id).exec();
  }

  async findAll(): Promise<T[]> {
    return await this._model.find().exec();
  }
}
