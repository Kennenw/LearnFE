import Brand from '../models/brand'
import GenericRepository from '../../../core/base/generic-repository';
import { BrandCreateDTO, BrandUpdateDTO, BrandViewDTO, toBrandViewDTO } from '../dtos/brand-dto';
import { PaginationResult } from '../../../core/types/common';
import { Pagination } from '../../../core/types/pagination';
import { IBrandService } from './ibrand-service';
import IGenericRepository from '../../../core/interfaces/igeneric-repository';

export class BrandService implements IBrandService {
    private brandRepo: IGenericRepository<Brand>;
    constructor(brandRepo: GenericRepository<Brand>) {
        this.brandRepo = brandRepo;
    }

    async createBrandAsync(value: BrandCreateDTO): Promise<void> {
        await this.brandRepo.addAsync(new Brand(value.name));
    }

    async updateBrandAsync(value: BrandUpdateDTO): Promise<void> {
        await this.brandRepo.editAsync(value.id, { name: value.name });
    }

    async getBrand(search: string, pageIndex: number = 1, pageSize: number = 10): Promise<PaginationResult<BrandViewDTO>> {
        const brands = await this.brandRepo.getAsync(pageIndex, pageSize, (b) => {
            return b.ilike('name', `%${search}%`);
        });
        return Pagination<BrandViewDTO>(brands.data.map((b: Brand) => toBrandViewDTO(b)), brands.count, pageSize, pageIndex);
    }

    async getBrandById(id: string): Promise<BrandViewDTO> {
        const data = await this.brandRepo.getByIdAsync(id);
        return toBrandViewDTO(data);
    }

    async deleteBrand(id: string): Promise<void> {
        await this.brandRepo.removeAsync(id);
    }
}