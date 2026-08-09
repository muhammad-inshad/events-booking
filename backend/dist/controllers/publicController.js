"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicServiceById = exports.getPublicServices = void 0;
const Service_1 = require("../models/Service");
const Booking_1 = require("../models/Booking");
const AppError_1 = require("../errors/AppError");
const getPublicServices = async (req, res) => {
    try {
        const { keyword, category, location, minPrice, maxPrice, startDate, endDate, page, limit } = req.query;
        let query = {};
        if (keyword) {
            query.title = { $regex: keyword, $options: 'i' };
        }
        if (category)
            query.category = category;
        if (location)
            query.location = { $regex: location, $options: 'i' };
        if (minPrice || maxPrice) {
            query.pricePerDay = {};
            if (minPrice)
                query.pricePerDay.$gte = Number(minPrice);
            if (maxPrice)
                query.pricePerDay.$lte = Number(maxPrice);
        }
        // Date filtering: find services that are NOT booked for the given dates
        if (startDate && endDate) {
            const sDate = new Date(startDate);
            const eDate = new Date(endDate);
            const overlappingBookings = await Booking_1.Booking.find({
                $or: [
                    { startDate: { $lte: eDate }, endDate: { $gte: sDate } }
                ]
            }).select('serviceId');
            const bookedServiceIds = overlappingBookings.map(b => b.serviceId);
            query._id = { $nin: bookedServiceIds };
        }
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 12; // default 12 items for grid
        const skip = (pageNum - 1) * limitNum;
        const total = await Service_1.Service.countDocuments(query);
        const services = await Service_1.Service.find(query)
            .select('-adminId -createdAt -updatedAt -__v')
            .skip(skip)
            .limit(limitNum);
        res.status(200).json({
            status: 'success',
            data: services,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum) || 1,
                totalItems: total
            }
        });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
exports.getPublicServices = getPublicServices;
const getPublicServiceById = async (req, res) => {
    try {
        const service = await Service_1.Service.findById(req.params.id).select('-adminId -createdAt -updatedAt -__v');
        if (!service)
            throw new AppError_1.AppError('Service not found', 404);
        res.status(200).json({ status: 'success', data: service });
    }
    catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
};
exports.getPublicServiceById = getPublicServiceById;
