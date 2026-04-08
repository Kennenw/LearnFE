import Brand from "../../brand/models/brand";
import Category from "../../category/models/category";
import Product from "../models/product";
import ProductVariant from "../models/product-variant";
import { ProductCreateDTO, ProductViewDTO, toProductViewDTO } from "./product-dto";
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
