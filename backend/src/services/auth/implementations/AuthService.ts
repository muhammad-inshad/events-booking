import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { HttpStatus } from '../../../constants/httpStatus';
import { IUserRepository } from '../../../repositories/user/interfaces/IUserRepository';
import { AppError } from '../../../errors/AppError';
import { IAuthService, AuthResult, RefreshResult } from '../interfaces/IAuthService';
import { LoginDTO, RegisterDTO } from '../../../dto/auth.dto';
import { IUser } from '../../../models/User';

interface RefreshTokenPayload {
  id: string;
}

const ACCESS_TOKEN_TTL = (process.env.JWT_EXPIRES_IN || '15m') as StringValue;
const REFRESH_TOKEN_TTL: StringValue = '7d';

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  async login(dto: LoginDTO): Promise<AuthResult> {
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

    const { token, refreshToken } = this.issueTokens(user);
    delete user.password;

    return { user, token, refreshToken };
  }

  async register(dto: RegisterDTO): Promise<AuthResult> {
    const { email, password, name } = dto;
    if (!email || !password || !name) {
      throw new AppError('Please provide name, email, and password', HttpStatus.BAD_REQUEST);
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email is already in use', HttpStatus.BAD_REQUEST);
    }

    // Force role to 'user' — admin/event_owner roles must be assigned by an admin
    const user = await this.userRepository.create({ name, email, password, role: 'user' });

    const { token, refreshToken } = this.issueTokens(user);
    delete user.password;

    return { user, token, refreshToken };
  }

  async refreshToken(token: string): Promise<RefreshResult> {
    if (!token) {
      throw new AppError('Refresh token is required', HttpStatus.BAD_REQUEST);
    }

    let decoded: RefreshTokenPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as RefreshTokenPayload;
    } catch {
      throw new AppError('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userRepository.findById(decoded.id);
    if (!user) {
      throw new AppError('User not found', HttpStatus.UNAUTHORIZED);
    }

    if (user.isBlocked) {
      throw new AppError('Your account has been suspended', HttpStatus.FORBIDDEN);
    }

    return this.issueTokens(user);
  }

  private issueTokens(user: IUser): { token: string; refreshToken: string } {
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: REFRESH_TOKEN_TTL }
    );

    return { token, refreshToken };
  }
}
