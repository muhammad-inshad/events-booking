import { Response, NextFunction } from 'express';
import { HttpStatus } from '../../../constants/httpStatus';
import { AppError } from '../../../errors/AppError';
import { AuthRequest } from '../../../middleware/auth';
import { IUserService } from '../../../services/user/interfaces/IUserService';
import { IUserController } from '../interfaces/IUserController';

export class UserController implements IUserController {
  constructor(private userService: IUserService) {}

  getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      const user = await this.userService.getCurrentUser(req.user.id);
      res.status(HttpStatus.OK).json({ status: 'success', data: user });
    } catch (error) {
      next(error);
    }
  };
}
