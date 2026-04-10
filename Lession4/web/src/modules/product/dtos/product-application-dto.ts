import { ProductCreateDTO, ProductUpdateDTO, ProductViewDTO } from "./product-dto";
import { ProductVariantAddDTO, ProductVariantUpdateDTO, ProductVariantViewDTO } from "./product-variant-dto";

export interface ProductDetailDTO {
    product: ProductViewDTO,
    variants: ProductVariantViewDTO[]
}

export interface ProductCreateApplicationDTO {
    product: ProductCreateDTO,
    variants: ProductVariantAddDTO[]
}

export interface ProductUpdateApplicationDTO {
    product?: Partial<ProductUpdateDTO>,
    variants?: Partial<ProductVariantUpdateDTO>[]
}

export function toProductVariantApplicationDTO(productId: string, variants: ProductVariantAddDTO[]): ProductVariantAddDTO[] {
    return variants.map(v => ({
        productId,
        size: v.size,
        color: v.color,
        price: v.price,
        stockQuantity: v.stockQuantity
    }));
}
