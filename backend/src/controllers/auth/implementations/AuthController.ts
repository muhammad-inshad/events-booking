import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../../constants/httpStatus';
import { IAuthService } from '../../../services/auth/interfaces/IAuthService';
import { IAuthController } from '../interfaces/IAuthController';
import { LoginDTO, RegisterDTO } from '../../../dto/auth.dto';

export class AuthController implements IAuthController {
  constructor(private authService: IAuthService) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: LoginDTO = req.body;
      const result = await this.authService.login(dto);

      res.status(HttpStatus.OK).json({
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

      res.status(HttpStatus.CREATED).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshToken(refreshToken);

      res.status(HttpStatus.OK).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}
