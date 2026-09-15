import jwt from 'jsonwebtoken';
import { HttpStatus } from '../../../constants/httpStatus';
import { IUserRepository } from '../../../repositories/user/interfaces/IUserRepository';
import { AppError } from '../../../errors/AppError';
import { IAuthService } from '../interfaces/IAuthService';
import { LoginDTO, RegisterDTO } from '../../../dto/auth.dto';

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  async login(dto: LoginDTO) {
    const { email, password } = dto;
    if (!email || !password) {
      throw new AppError('Please provide email and password', HttpStatus.BAD_REQUEST);
    }

    // Find the user with password field included for comparison
    const user = await this.userRepository.findByEmailWithPassword(email);
    
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Incorrect email or password', HttpStatus.UNAUTHORIZED);
    }

    if (user.isBlocked) {
      throw new AppError('Your account has been suspended', HttpStatus.FORBIDDEN);
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
      throw new AppError('Please provide name, email, and password', HttpStatus.BAD_REQUEST);
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email is already in use', HttpStatus.BAD_REQUEST);
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

  async refreshToken(token: string) {
    if (!token) {
      throw new AppError('Refresh token is required', HttpStatus.BAD_REQUEST);
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret');
    } catch (error) {
      throw new AppError('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userRepository.findById(decoded.id);
    if (!user) {
      throw new AppError('User not found', HttpStatus.UNAUTHORIZED);
    }

    if (user.isBlocked) {
      throw new AppError('Your account has been suspended', HttpStatus.FORBIDDEN);
    }

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any } as jwt.SignOptions
    );

    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
      { expiresIn: '7d' }
    );

    return {
      token: newAccessToken,
      refreshToken: newRefreshToken
    };
  }
}
