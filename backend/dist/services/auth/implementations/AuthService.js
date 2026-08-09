"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../../../errors/AppError");
class AuthService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async login(dto) {
        const { email, password } = dto;
        if (!email || !password) {
            throw new AppError_1.AppError('Please provide email and password', 400);
        }
        // Find the user with password field included for comparison
        const user = await this.userRepository.findByEmailWithPassword(email);
        if (!user || !(await user.comparePassword(password))) {
            throw new AppError_1.AppError('Incorrect email or password', 401);
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: (process.env.JWT_EXPIRES_IN || '15m') });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret', { expiresIn: '7d' });
        delete user.password;
        return {
            user,
            token,
            refreshToken
        };
    }
    async register(dto) {
        const { email, password, name, role } = dto;
        if (!email || !password || !name) {
            throw new AppError_1.AppError('Please provide name, email, and password', 400);
        }
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new AppError_1.AppError('Email is already in use', 400);
        }
        const userData = { name, email, password };
        if (role)
            userData.role = role;
        const user = await this.userRepository.create(userData);
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: (process.env.JWT_EXPIRES_IN || '15m') });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret', { expiresIn: '7d' });
        delete user.password;
        return {
            user,
            token,
            refreshToken
        };
    }
}
exports.AuthService = AuthService;
