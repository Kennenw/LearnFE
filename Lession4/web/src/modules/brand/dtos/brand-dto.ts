import { PaginationQuery } from "../../../core/types/common";
import Brand from "../models/brand";

export interface BrandCreateDTO {
    name: string;
}

export interface BrandUpdateDTO extends BrandCreateDTO {
    id: string;
}

export interface BrandViewDTO {
    id: string;
    name: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BrandPaginationQuery extends PaginationQuery {
}

export function toBrandViewDTO(brand?: Brand): BrandViewDTO {
    if (!brand) {
        throw new Error("Brand is undefined");
    }
    
    return {
        id: brand.id,
        name: brand.name
    };
}