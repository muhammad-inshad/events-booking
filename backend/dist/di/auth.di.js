"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authContainer = void 0;
const UserRepository_1 = require("../repositories/user/implementations/UserRepository");
const AuthService_1 = require("../services/auth/implementations/AuthService");
const AuthController_1 = require("../controllers/auth/implementations/AuthController");
const authContainer = () => {
    const userRepository = new UserRepository_1.UserRepository();
    const authService = new AuthService_1.AuthService(userRepository);
    const authController = new AuthController_1.AuthController(authService);
    return {
        userRepository,
        authService,
        authController
    };
};
exports.authContainer = authContainer;
