import { HttpStatus } from '../../../constants/httpStatus';
import { AppError } from '../../../errors/AppError';
import { IUser } from '../../../models/User';
import { IUserRepository } from '../../../repositories/user/interfaces/IUserRepository';
import { IUserService } from '../interfaces/IUserService';
import { UpdateUserRoleDTO, ToggleUserBlockDTO } from '../../../dto/user.dto';

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async getCurrentUser(userId: string): Promise<IUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async listUsers(): Promise<IUser[]> {
    return await this.userRepository.findAllSortedByNewest();
  }

  async updateUserRole(userId: string, dto: UpdateUserRoleDTO): Promise<IUser> {
    const user = await this.userRepository.update(userId, { role: dto.role });
    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async toggleUserBlock(userId: string, dto: ToggleUserBlockDTO): Promise<IUser> {
    const user = await this.userRepository.update(userId, { isBlocked: dto.isBlocked });
    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
