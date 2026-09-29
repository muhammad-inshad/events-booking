import { IUser } from '../../../models/User';
import { LoginDTO, RegisterDTO } from '../../../dto/auth.dto';

export interface AuthResult {
  user: IUser;
  token: string;
  refreshToken: string;
}

export interface RefreshResult {
  token: string;
  refreshToken: string;
}

export interface IAuthService {
  login(dto: LoginDTO): Promise<AuthResult>;
  register(dto: RegisterDTO): Promise<AuthResult>;
  refreshToken(token: string): Promise<RefreshResult>;
}
