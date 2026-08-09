import { IUser } from '../../../models/User';
import { LoginDTO, RegisterDTO } from '../../../dto/auth.dto';

export interface IAuthService {
  login(dto: LoginDTO): Promise<{ user: IUser, token: string, refreshToken: string }>;
  register(dto: RegisterDTO): Promise<{ user: IUser, token: string, refreshToken: string }>;
}
