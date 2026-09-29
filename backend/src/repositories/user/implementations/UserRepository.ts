import { BaseRepository } from '../../base/implementations/BaseRepository';
import { IUserRepository } from '../interfaces/IUserRepository';
import { IUser, UserModel } from '../../../models/User';

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this._model.findOne({ email }).exec();
  }

  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    return await this._model.findOne({ email }).select('+password').exec();
  }

  async findAllSortedByNewest(): Promise<IUser[]> {
    return await this._model.find().sort({ createdAt: -1 }).exec();
  }
}
