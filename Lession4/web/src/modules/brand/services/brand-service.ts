import Brand from '../models/brand'
import { BrandCreateDTO, BrandPaginationQuery, BrandUpdateDTO, BrandViewDTO, toBrandViewDTO } from '../dtos/brand-dto';
import { PaginationResult } from '@core/types/common';
import { IBrandService } from './ibrand-service';
import IGenericRepository from '@core/interfaces/igeneric-repository';
import { Pagination } from '@core/utils/pagination';

export class BrandService implements IBrandService {
    private brandRepo: IGenericRepository<Brand>;
    constructor(brandRepo: IGenericRepository<Brand>) {
        this.brandRepo = brandRepo;
    }

    async createAsync(value: BrandCreateDTO): Promise<string> {
        await this.brandRepo.addAsync(new Brand(value.name));
        return "Tạo hãng thành công";
    }

    async updateAsync(value: BrandUpdateDTO): Promise<string> {
        await this.brandRepo.getByIdAsync(value.id);
        await this.brandRepo.editAsync(value.id, { name: value.name });
        return "Cập nhật hãng thành công";
    }

    async getAsync(query: BrandPaginationQuery): Promise<PaginationResult<BrandViewDTO>> {
        const brands = await this.brandRepo.getAsync(query.pageIndex, query.pageSize, (queryDB) => {
            let querySeach = queryDB.select('*');
            if (query.search) {
                querySeach = querySeach.ilike('name', `%${query.search}%`);
            }
            return querySeach;
        });
        return Pagination<BrandViewDTO>(brands.data.map((b: Brand) => toBrandViewDTO(b)), brands.count, query.pageSize, query.pageIndex);
    }

    async getByIdAsync(id: string): Promise<BrandViewDTO> {
        const brand = await this.brandRepo.getByIdAsync(id);
        if (!brand) return Promise.reject(Error('Hãng không tồn tại'));
        return toBrandViewDTO(brand);
    }

    async deleteAsync(id: string): Promise<string> {
        await this.brandRepo.getByIdAsync(id);
        await this.brandRepo.removeAsync(id);
        return "Xóa hãng thành công";
    }
}