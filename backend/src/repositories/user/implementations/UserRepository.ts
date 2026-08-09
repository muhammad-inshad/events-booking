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
    // Select the password field which is normally excluded
    return await this._model.findOne({ email }).select('+password').exec();
  }
}
