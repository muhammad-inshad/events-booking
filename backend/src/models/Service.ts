import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  title: string;
  category: string;
  location: string;
  lat?: number;
  lng?: number;
  pricePerDay: number;
  description: string;
  startDate?: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  contactDetails: string;
  imageUrl?: string;
  adminId: mongoose.Types.ObjectId;
}

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number },
    pricePerDay: { type: Number, required: true },
    description: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    startTime: { type: String },
    endTime: { type: String },
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

serviceSchema.index({ endDate: 1 }, { expireAfterSeconds: 172800 });

export const Service = mongoose.model<IService>('Service', serviceSchema);
