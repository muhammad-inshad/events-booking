"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    login = async (req, res, next) => {
        try {
            const dto = req.body;
            const result = await this.authService.login(dto);
            res.status(200).json({
                status: 'success',
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    };
    register = async (req, res, next) => {
        try {
            const dto = req.body;
            const result = await this.authService.register(dto);
            res.status(201).json({
                status: 'success',
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuthController = AuthController;
