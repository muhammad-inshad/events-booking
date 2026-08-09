import { Request, Response } from 'express';
import { Service } from '../models/Service';
import { Booking } from '../models/Booking';
import { AppError } from '../errors/AppError';

export const getPublicServices = async (req: Request, res: Response) => {
  try {
    const { keyword, category, location, minPrice, maxPrice, startDate, endDate, page, limit } = req.query;
    
    let query: any = {};

    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' };
    }
    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    // Date filtering: find services that are NOT booked for the given dates
    if (startDate && endDate) {
      const sDate = new Date(startDate as string);
      const eDate = new Date(endDate as string);
      
      const overlappingBookings = await Booking.find({
        $or: [
          { startDate: { $lte: eDate }, endDate: { $gte: sDate } }
        ]
      }).select('serviceId');
      
      const bookedServiceIds = overlappingBookings.map(b => b.serviceId);
      query._id = { $nin: bookedServiceIds };
    }

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 12; // default 12 items for grid
    const skip = (pageNum - 1) * limitNum;

    const total = await Service.countDocuments(query);
    const services = await Service.find(query)
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
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getPublicServiceById = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id).select('-adminId -createdAt -updatedAt -__v');
    if (!service) throw new AppError('Service not found', 404);

    res.status(200).json({ status: 'success', data: service });
  } catch (error: any) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};
