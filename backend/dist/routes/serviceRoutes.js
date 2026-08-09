"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRoutes = void 0;
const express_1 = require("express");
const serviceController_1 = require("../controllers/serviceController");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
exports.serviceRoutes = router;
// Simple auth middleware for now
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token)
            return res.status(401).json({ message: 'No token provided' });
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
const adminMiddleware = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};
// Public routes
router.get('/', serviceController_1.getServices);
// Admin only routes
router.use(authMiddleware);
router.use(adminMiddleware);
router.post('/', upload_1.upload.single('imageFile'), serviceController_1.createService);
router.put('/:id', upload_1.upload.single('imageFile'), serviceController_1.updateService);
router.delete('/:id', serviceController_1.deleteService);
router.get('/bookings', serviceController_1.getAdminBookings);
