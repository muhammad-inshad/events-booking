import { Readable } from 'stream';
import cloudinary from '../../../config/cloudinary';
import { AppError } from '../../../errors/AppError';
import { HttpStatus } from '../../../constants/httpStatus';
import { IImageUploadService } from '../interfaces/IImageUploadService';

const UPLOAD_FOLDER = 'events-booking';

export class CloudinaryImageUploadService implements IImageUploadService {
  upload(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: UPLOAD_FOLDER },
        (error, result) => {
          if (error || !result) {
            reject(new AppError('Failed to upload image', HttpStatus.INTERNAL_SERVER_ERROR));
            return;
          }
          resolve(result.secure_url);
        }
      );
      Readable.from(buffer).pipe(stream);
    });
  }
}
