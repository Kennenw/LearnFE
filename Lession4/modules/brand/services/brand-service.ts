import Brand from '../models/brand'
import { BrandCreateDTO, BrandUpdateDTO, BrandViewDTO, toBrandViewDTO } from '../dtos/brand-dto';
import { PaginationResult } from '../../../core/types/common';
import { IBrandService } from './ibrand-service';
import IGenericRepository from '../../../core/interfaces/igeneric-repository';
import { Pagination } from '../../../core/utils/pagination';

export class BrandService implements IBrandService {
    private brandRepo: IGenericRepository<Brand>;
    constructor(brandRepo: IGenericRepository<Brand>) {
        this.brandRepo = brandRepo;
    }

    async createBrandAsync(value: BrandCreateDTO): Promise<string> {
        await this.brandRepo.addAsync(new Brand(value.name));
        return "Tạo hãng thành công";
    }

    async updateBrandAsync(value: BrandUpdateDTO): Promise<string> {
        const data = await this.brandRepo.getByIdAsync(value.id);
        if (!data) return Promise.reject(Error('Hãng không tồn tại'));
        await this.brandRepo.editAsync(value.id, { name: value.name });
        return "Cập nhật hãng thành công";
    }

    async getBrand(search?: string, pageIndex?: number, pageSize?: number): Promise<PaginationResult<BrandViewDTO>> {
        const brands = await this.brandRepo.getAsync(pageIndex, pageSize, (b) => {
            return b.select('*').ilike('name', `%${search}%`);
        });
        return Pagination<BrandViewDTO>(brands.data.map((b: Brand) => toBrandViewDTO(b)), brands.count, pageSize, pageIndex);
    }

    async getBrandById(id: string): Promise<BrandViewDTO> {
        const data = await this.brandRepo.getByIdAsync(id);
        if (!data) return Promise.reject(Error('Hãng không tồn tại'));
        return toBrandViewDTO(data);
    }

    async deleteBrand(id: string): Promise<string> {
        const data = await this.brandRepo.getByIdAsync(id);
        if (!data) return Promise.reject(Error('Hãng không tồn tại'));
        await this.brandRepo.removeAsync(id);
        return "Xóa hãng thành công";
    }
}