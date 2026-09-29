import { IService } from '../../../models/Service';
import { CreateServiceDTO, PaginatedResult, ServiceListQueryDTO, UpdateServiceDTO } from '../../../dto/service.dto';

export interface IServiceService {
  listServices(query: ServiceListQueryDTO): Promise<PaginatedResult<IService>>;
  createService(adminId: string, dto: CreateServiceDTO, imageBuffer?: Buffer): Promise<IService>;
  updateService(id: string, adminId: string, dto: UpdateServiceDTO, imageBuffer?: Buffer): Promise<IService>;
  deleteService(id: string, adminId: string): Promise<void>;
}
