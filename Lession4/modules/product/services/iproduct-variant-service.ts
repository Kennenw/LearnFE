import { PaginationResult } from "../../../core/types/common";
import { ProductVariantAddDTO, ProductVariantUpdateDTO, ProductVariantViewDTO } from "../dtos/product-variant-dto";

export default interface IProductVariantService {
    addProductVariant(value: ProductVariantAddDTO): Promise<string>;
    getVariantByProductId(id: string): Promise<ProductVariantViewDTO[]>;
    updateProductVariant(id: string, value: ProductVariantUpdateDTO): Promise<string>;
    deleteProductVariant(id: string): Promise<string>;
}