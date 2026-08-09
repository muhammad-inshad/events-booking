import { IBaseRepository } from '../../base/interfaces/IBaseRepository';
import { IUser } from '../../../models/User';

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findByEmailWithPassword(email: string): Promise<IUser | null>;
}
