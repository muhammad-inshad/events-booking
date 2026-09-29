import { IUser } from '../../../models/User';
import { UpdateUserRoleDTO, ToggleUserBlockDTO } from '../../../dto/user.dto';

export interface IUserService {
  getCurrentUser(userId: string): Promise<IUser>;
  listUsers(): Promise<IUser[]>;
  updateUserRole(userId: string, dto: UpdateUserRoleDTO): Promise<IUser>;
  toggleUserBlock(userId: string, dto: ToggleUserBlockDTO): Promise<IUser>;
}
