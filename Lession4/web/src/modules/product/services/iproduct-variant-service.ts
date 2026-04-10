import { ProductVariantAddDTO, ProductVariantUpdateDTO, ProductVariantViewDTO } from "../dtos/product-variant-dto";

export default interface IProductVariantService {
    addAsync(value: ProductVariantAddDTO): Promise<string>;
    getByProductIdAsync(id: string): Promise<ProductVariantViewDTO[]>;
    updateAsync(value: ProductVariantUpdateDTO): Promise<string>;
    deleteAsync(id: string): Promise<string>;
    deleteByProductIdAsync(id: string): Promise<boolean>;
}