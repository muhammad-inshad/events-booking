export interface IImageUploadService {
  upload(buffer: Buffer): Promise<string>;
}
