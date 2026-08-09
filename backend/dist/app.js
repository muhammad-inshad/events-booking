"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const errorHandler_1 = require("./middleware/errorHandler");
const AppError_1 = require("./errors/AppError");
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false, // Allow frontend to load images
}));
// Static files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
const authRoutes_1 = require("./routes/authRoutes");
const serviceRoutes_1 = require("./routes/serviceRoutes");
const publicRoutes_1 = require("./routes/publicRoutes");
const userRoutes_1 = require("./routes/userRoutes");
app.use('/api/auth', authRoutes_1.authRoutes);
app.use('/api/services', serviceRoutes_1.serviceRoutes);
app.use('/api/public', publicRoutes_1.publicRoutes);
app.use('/api/user', userRoutes_1.userRoutes);
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is healthy' });
});
app.use((req, res, next) => {
    next(new AppError_1.AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorHandler_1.errorHandler);
exports.default = app;
