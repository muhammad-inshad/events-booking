import { Request, Response } from 'express';
import { HttpStatus } from '../constants/httpStatus';
import { Category } from '../models/Category';
import { AppError } from '../errors/AppError';

// Public endpoint to get all unique categories across all owners
export const getPublicCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.distinct('name');
    res.status(HttpStatus.OK).json({ status: 'success', data: categories });
  } catch (error: any) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'error', message: error.message });
  }
};

// Get categories for a specific event owner
export const getCategories = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user?.id;
    if (!adminId) throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);

    const categories = await Category.find({ adminId }).sort({ createdAt: -1 });
    res.status(HttpStatus.OK).json({ status: 'success', data: categories });
  } catch (error: any) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'error', message: error.message });
  }
};

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user?.id;
    if (!adminId) throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);

    const { name } = req.body;
    if (!name) throw new AppError('Category name is required', HttpStatus.BAD_REQUEST);

    // Check if category already exists for this owner (case insensitive)
    const existing = await Category.findOne({ adminId, name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) throw new AppError('Category already exists', HttpStatus.BAD_REQUEST);

    const category = await Category.create({ name, adminId });
    res.status(HttpStatus.CREATED).json({ status: 'success', data: category });
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ status: 'error', message: error.message });
  }
};

// Update a category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user?.id;
    const { name } = req.body;

    if (!name) throw new AppError('Category name is required', HttpStatus.BAD_REQUEST);

    const category = await Category.findOneAndUpdate(
      { _id: id, adminId } as any,
      { name },
      { new: true, runValidators: true }
    );

    if (!category) throw new AppError('Category not found or unauthorized', HttpStatus.NOT_FOUND);

    res.status(HttpStatus.OK).json({ status: 'success', data: category });
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ status: 'error', message: error.message });
  }
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user?.id;

    const category = await Category.findOneAndDelete({ _id: id, adminId } as any);
    if (!category) throw new AppError('Category not found or unauthorized', HttpStatus.NOT_FOUND);

    res.status(HttpStatus.OK).json({ status: 'success', message: 'Category deleted successfully' });
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ status: 'error', message: error.message });
  }
};
