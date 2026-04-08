import { Size } from "../../../core/enum/product-variant";
import ProductVariant from "../models/product-variant";

export interface ProductVariantViewDTO {
    id: string;
    productId: string;
    size: Size;
    color: string;
    price: number;
    stockQuantity: number;
}

export interface ProductVariantAddDTO {
    productId: string;
    size: Size;
    color: string;
    price: number;
    stockQuantity: number;
}

export interface ProductVariantUpdateDTO extends Partial<Omit<ProductVariant, 'id'>> {

}

export function toProductVariantViewDTO(value: ProductVariant): ProductVariantViewDTO {
    return {
        id: value.id,
        color: value.color,
        price: value.price,
        productId: value.productId,
        size: value.size,
        stockQuantity: value.stockQuantity
    }
}