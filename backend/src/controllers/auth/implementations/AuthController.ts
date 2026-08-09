import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../../../services/auth/interfaces/IAuthService';
import { IAuthController } from '../interfaces/IAuthController';
import { LoginDTO, RegisterDTO } from '../../../dto/auth.dto';

export class AuthController implements IAuthController {
  constructor(private authService: IAuthService) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: LoginDTO = req.body;
      const result = await this.authService.login(dto);

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: RegisterDTO = req.body;
      const result = await this.authService.register(dto);

      res.status(201).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}
