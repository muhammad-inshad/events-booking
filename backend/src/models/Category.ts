import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  adminId: mongoose.Types.ObjectId;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>('Category', categorySchema);
