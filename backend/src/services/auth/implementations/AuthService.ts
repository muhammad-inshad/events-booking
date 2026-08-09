import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../../repositories/user/interfaces/IUserRepository';
import { AppError } from '../../../errors/AppError';
import { IAuthService } from '../interfaces/IAuthService';
import { LoginDTO, RegisterDTO } from '../../../dto/auth.dto';

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  async login(dto: LoginDTO) {
    const { email, password } = dto;
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    // Find the user with password field included for comparison
    const user = await this.userRepository.findByEmailWithPassword(email);
    
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
      { expiresIn: '7d' }
    );

    delete (user as any).password;

    return {
      user,
      token,
      refreshToken
    };
  }

  async register(dto: RegisterDTO) {
    const { email, password, name, role } = dto;
    if (!email || !password || !name) {
      throw new AppError('Please provide name, email, and password', 400);
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email is already in use', 400);
    }

    const userData: any = { name, email, password };
    if (role) userData.role = role;

    const user = await this.userRepository.create(userData);
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
      { expiresIn: '7d' }
    );

    delete (user as any).password;

    return {
      user,
      token,
      refreshToken
    };
  }
}
