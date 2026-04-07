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

export function toBrandViewDTO(brand?: Brand): BrandViewDTO {
    if (!brand) throw new Error("Brand is undefined");
    return {
        id: brand.id,
        name: brand.name
    };
}