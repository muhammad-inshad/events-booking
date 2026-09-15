import { Request, Response } from 'express';
import { HttpStatus } from '../constants/httpStatus';
import { Readable } from 'stream';
import { Service } from '../models/Service';
import { Booking } from '../models/Booking';
import { AppError } from '../errors/AppError';
import cloudinary from '../config/cloudinary';

const uploadToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'events-booking' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};

// Get all services
export const getServices = async (req: Request, res: Response) => {
  try {
    const { keyword, category } = req.query;
    let query: any = {};

    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' };
    }
    
    if (category) {
      query.category = category;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    const total = await Service.countDocuments(query);
    const services = await Service.find(query).skip(skip).limit(limit);
    
    res.status(HttpStatus.OK).json({ 
      status: 'success', 
      data: services,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit) || 1,
        totalItems: total
      }
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'error', message: 'Error fetching services' });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user?.id; 
    if (!adminId) throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);

    const serviceData = { ...req.body, adminId };
    
    if (req.file) {
      serviceData.imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const service = await Service.create(serviceData);
    res.status(HttpStatus.CREATED).json({ status: 'success', data: service });
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ status: 'error', message: error.message });
  }
};

// Update a service
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user?.id;

    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const service = await Service.findOneAndUpdate(
      { _id: id, adminId } as any,
      updateData,
      { new: true, runValidators: true }
    );

    if (!service) throw new AppError('Service not found or unauthorized', HttpStatus.NOT_FOUND);

    res.status(HttpStatus.OK).json({ status: 'success', data: service });
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ status: 'error', message: error.message });
  }
};

// Delete a service
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user?.id;

    const service = await Service.findOneAndDelete({ _id: id, adminId } as any);
    if (!service) throw new AppError('Service not found or unauthorized', HttpStatus.NOT_FOUND);

    res.status(HttpStatus.OK).json({ status: 'success', message: 'Service deleted successfully' });
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ status: 'error', message: error.message });
  }
};

export const getAdminBookings = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user?.id;
    if (!adminId) throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);

    const services = await Service.find({ adminId }).select('_id');
    const serviceIds = services.map(s => s._id);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    const total = await Booking.countDocuments({ serviceId: { $in: serviceIds } });

    // Find all bookings for those services
    const bookings = await Booking.find({ serviceId: { $in: serviceIds } })
      .populate('serviceId', 'title')
      .populate('userId', 'name email')
      .skip(skip)
      .limit(limit);

    res.status(HttpStatus.OK).json({ 
      status: 'success', 
      data: bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit) || 1,
        totalItems: total
      }
    });
  } catch (error: any) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'error', message: error.message });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user?.id;
    if (!adminId) throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);

    const services = await Service.find({ adminId }).select('_id');
    const serviceIds = services.map(s => s._id);

    // Get bookings from the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const bookings = await Booking.find({ 
      serviceId: { $in: serviceIds },
      createdAt: { $gte: sixMonthsAgo }
    }).sort({ createdAt: 1 });

    // Group by month
    const monthlyStats: Record<string, number> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Initialize last 6 months with 0
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      monthlyStats[`${monthNames[d.getMonth()]} ${d.getFullYear()}`] = 0;
    }

    bookings.forEach(booking => {
      const d = new Date(booking.createdAt);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (monthlyStats[key] !== undefined) {
        monthlyStats[key]++;
      }
    });

    const formattedData = Object.keys(monthlyStats).map(key => ({
      name: key,
      bookings: monthlyStats[key]
    }));

    res.status(HttpStatus.OK).json({ 
      status: 'success', 
      data: formattedData
    });
  } catch (error: any) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'error', message: error.message });
  }
};
