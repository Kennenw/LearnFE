import Brand from "../models/brand";
import GenericRepository from "@infrastructure/database/repositories/generic-repository";
import IGenericRepository from "@core/interfaces/igeneric-repository";
import { IBrandService } from "../services/ibrand-service";
import { BrandService } from "../services/brand-service";
import { BrandCreateDTO, BrandPaginationQuery, BrandUpdateDTO } from "../dtos/brand-dto";

const brandRepo: IGenericRepository<Brand> = new GenericRepository<Brand>('brands');
const brandService: IBrandService = new BrandService(brandRepo);

export const BrandController = {
    async getBrands(query: BrandPaginationQuery) {
        return await brandService.getAsync(query);
    },

    async getBrandById(id: string) {
        return await brandService.getByIdAsync(id);
    },

    async createBrand(data: BrandCreateDTO) {
        return await brandService.createAsync(data);
    },

    async updateBrand(data: BrandUpdateDTO) {
        return await brandService.updateAsync(data);
    },

    async deleteBrand(id: string) {
        return await brandService.deleteAsync(id);
    }
};