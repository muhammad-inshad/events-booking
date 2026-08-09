import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  title: string;
  category: string;
  location: string;
  pricePerDay: number;
  description: string;
  availabilityDates: Date[];
  contactDetails: string;
  imageUrl?: string;
  adminId: mongoose.Types.ObjectId;
}

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    description: { type: String, required: true },
    availabilityDates: [{ type: Date }],
    contactDetails: { 
      type: String, 
      required: true,
      match: [/^\+?[0-9]{10,15}$/, 'Please provide a valid phone number']
    },
    imageUrl: { type: String },
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Service = mongoose.model<IService>('Service', serviceSchema);
