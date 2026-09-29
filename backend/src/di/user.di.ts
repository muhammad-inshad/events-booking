import { UserRepository } from '../repositories/user/implementations/UserRepository';
import { UserService } from '../services/user/implementations/UserService';
import { UserController } from '../controllers/user/implementations/UserController';
import { AdminController } from '../controllers/admin/implementations/AdminController';

export const userContainer = () => {
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);
  const adminController = new AdminController(userService);

  return {
    userRepository,
    userService,
    userController,
    adminController
  };
};
