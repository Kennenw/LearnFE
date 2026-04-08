import { PaginationResult } from "../../../core/types/common";
import { BrandCreateDTO, BrandUpdateDTO, BrandViewDTO } from "../dtos/brand-dto";

export interface IBrandService {
    createBrandAsync(value: BrandCreateDTO): Promise<string>;
    updateBrandAsync(value: BrandUpdateDTO): Promise<string>;
    getBrand(search?: string, pageIndex?: number, pageSize?: number): Promise<PaginationResult<BrandViewDTO>>;
    getBrandById(id: string): Promise<BrandViewDTO>;
    deleteBrand(id: string): Promise<string>;
}