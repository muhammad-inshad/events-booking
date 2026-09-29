import { IBaseRepository } from '../../base/interfaces/IBaseRepository';
import { ICategory } from '../../../models/Category';

export interface ICategoryRepository extends IBaseRepository<ICategory> {
  findByAdmin(adminId: string): Promise<ICategory[]>;
  findByNameForAdmin(adminId: string, name: string): Promise<ICategory | null>;
  updateForAdmin(id: string, adminId: string, data: Partial<ICategory>): Promise<ICategory | null>;
  deleteForAdmin(id: string, adminId: string): Promise<ICategory | null>;
  findDistinctNames(): Promise<string[]>;
}
