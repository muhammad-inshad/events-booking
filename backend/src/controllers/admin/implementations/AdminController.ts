import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../../constants/httpStatus';
import { IUserService } from '../../../services/user/interfaces/IUserService';
import { IAdminController } from '../interfaces/IAdminController';
import { UpdateUserRoleDTO, ToggleUserBlockDTO } from '../../../dto/user.dto';

export class AdminController implements IAdminController {
  constructor(private userService: IUserService) {}

  getUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.listUsers();
      res.status(HttpStatus.OK).json({ status: 'success', data: users });
    } catch (error) {
      next(error);
    }
  };

  updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const dto: UpdateUserRoleDTO = req.body;
      const user = await this.userService.updateUserRole(id, dto);
      res.status(HttpStatus.OK).json({ status: 'success', data: user });
    } catch (error) {
      next(error);
    }
  };

  toggleUserBlock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const dto: ToggleUserBlockDTO = req.body;
      const user = await this.userService.toggleUserBlock(id, dto);
      res.status(HttpStatus.OK).json({ status: 'success', data: user });
    } catch (error) {
      next(error);
    }
  };
}
