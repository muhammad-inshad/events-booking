import { UserRepository } from '../repositories/user/implementations/UserRepository';
import { AuthService } from '../services/auth/implementations/AuthService';
import { AuthController } from '../controllers/auth/implementations/AuthController';

export const authContainer = () => {
  const userRepository = new UserRepository();
  const authService = new AuthService(userRepository);
  const authController = new AuthController(authService);

  return {
    userRepository,
    authService,
    authController
  };
};
