"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminBookings = exports.deleteService = exports.updateService = exports.createService = exports.getServices = void 0;
const Service_1 = require("../models/Service");
const Booking_1 = require("../models/Booking");
const AppError_1 = require("../errors/AppError");
// Get all services
const getServices = async (req, res) => {
    try {
        const { keyword, category } = req.query;
        let query = {};
        if (keyword) {
            query.title = { $regex: keyword, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const total = await Service_1.Service.countDocuments(query);
        const services = await Service_1.Service.find(query).skip(skip).limit(limit);
        res.status(200).json({
            status: 'success',
            data: services,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit) || 1,
                totalItems: total
            }
        });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: 'Error fetching services' });
    }
};
exports.getServices = getServices;
// Create a new service (admin only)
const createService = async (req, res) => {
    try {
        const adminId = req.user?.id; // Assuming auth middleware adds user to req
        if (!adminId)
            throw new AppError_1.AppError('Unauthorized', 401);
        const serviceData = { ...req.body, adminId };
        if (req.file) {
            serviceData.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        }
        const service = await Service_1.Service.create(serviceData);
        res.status(201).json({ status: 'success', data: service });
    }
    catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};
exports.createService = createService;
// Update a service
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user?.id;
        const updateData = { ...req.body };
        if (req.file) {
            updateData.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        }
        const service = await Service_1.Service.findOneAndUpdate({ _id: id, adminId }, updateData, { new: true, runValidators: true });
        if (!service)
            throw new AppError_1.AppError('Service not found or unauthorized', 404);
        res.status(200).json({ status: 'success', data: service });
    }
    catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};
exports.updateService = updateService;
// Delete a service
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user?.id;
        const service = await Service_1.Service.findOneAndDelete({ _id: id, adminId });
        if (!service)
            throw new AppError_1.AppError('Service not found or unauthorized', 404);
        res.status(200).json({ status: 'success', message: 'Service deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};
exports.deleteService = deleteService;
// Get bookings for an admin's services
const getAdminBookings = async (req, res) => {
    try {
        const adminId = req.user?.id;
        if (!adminId)
            throw new AppError_1.AppError('Unauthorized', 401);
        // Find all services owned by this admin
        const services = await Service_1.Service.find({ adminId }).select('_id');
        const serviceIds = services.map(s => s._id);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const total = await Booking_1.Booking.countDocuments({ serviceId: { $in: serviceIds } });
        // Find all bookings for those services
        const bookings = await Booking_1.Booking.find({ serviceId: { $in: serviceIds } })
            .populate('serviceId', 'title')
            .populate('userId', 'name email')
            .skip(skip)
            .limit(limit);
        res.status(200).json({
            status: 'success',
            data: bookings,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit) || 1,
                totalItems: total
            }
        });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
exports.getAdminBookings = getAdminBookings;
