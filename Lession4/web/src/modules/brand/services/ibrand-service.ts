import { PaginationResult } from "@core/types/common";
import { BrandCreateDTO, BrandPaginationQuery, BrandUpdateDTO, BrandViewDTO } from "../dtos/brand-dto";

export interface IBrandService {
    createAsync(value: BrandCreateDTO): Promise<string>;
    updateAsync(value: BrandUpdateDTO): Promise<string>;
    getAsync(query: BrandPaginationQuery): Promise<PaginationResult<BrandViewDTO>>;
    getByIdAsync(id: string): Promise<BrandViewDTO>;
    deleteAsync(id: string): Promise<string>;
}