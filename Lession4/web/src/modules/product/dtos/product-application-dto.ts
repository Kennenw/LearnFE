import { ProductCreateDTO, ProductViewDTO } from "./product-dto";
import { ProductVariantAddDTO, ProductVariantViewDTO } from "./product-variant-dto";

export interface ProductDetailDTO {
    product: ProductViewDTO,
    variant: ProductVariantViewDTO[]
}

export interface ProductCreateApplicationDTO {
    product: ProductCreateDTO,
    variant: ProductVariantAddDTO[]
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
