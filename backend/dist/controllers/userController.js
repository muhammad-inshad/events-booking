"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserBookings = exports.createUserBooking = void 0;
const Booking_1 = require("../models/Booking");
const Service_1 = require("../models/Service");
const AppError_1 = require("../errors/AppError");
const createUserBooking = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new AppError_1.AppError('Unauthorized', 401);
        const { serviceId, startDate, endDate, totalPrice } = req.body;
        const sDate = new Date(startDate);
        const eDate = new Date(endDate);
        // Validate service exists
        const service = await Service_1.Service.findById(serviceId);
        if (!service)
            throw new AppError_1.AppError('Service not found', 404);
        // Check for overlapping bookings
        const overlapping = await Booking_1.Booking.findOne({
            serviceId,
            $or: [
                { startDate: { $lte: eDate }, endDate: { $gte: sDate } }
            ]
        });
        if (overlapping) {
            throw new AppError_1.AppError('Service is already booked for these dates', 400);
        }
        const booking = await Booking_1.Booking.create({
            userId,
            serviceId,
            startDate: sDate,
            endDate: eDate,
            totalPrice
        });
        res.status(201).json({ status: 'success', data: booking });
    }
    catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};
exports.createUserBooking = createUserBooking;
const getUserBookings = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new AppError_1.AppError('Unauthorized', 401);
        const bookings = await Booking_1.Booking.find({ userId })
            .populate('serviceId', 'title category location')
            .sort({ startDate: -1 });
        res.status(200).json({ status: 'success', data: bookings });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
exports.getUserBookings = getUserBookings;
