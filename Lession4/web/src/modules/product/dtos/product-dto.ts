import { ProductStatus } from "@core/enum/product";
import { PaginationQuery } from "@core/types/common";
import { Sort } from "@core/enum/common";

export interface ProductViewDTO {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    categoryName: string;
    brandId: string;
    brandName: string;
    status: ProductStatus;
}

export interface ProductPaginationQuery extends PaginationQuery {
    categoryId?: string;
    brandId?: string;
}

export interface ProductCreateDTO {
    name: string;
    description: string;
    categoryId: string;
    brandId: string;
    status: ProductStatus;
}

export interface ProductUpdateDTO extends Partial<ProductCreateDTO> {
    id: string;
}

export function toProductViewDTO(product: any): ProductViewDTO {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        categoryName: product.categories.name,
        brandId: product.brandId,
        brandName: product.brands.name,
        status: product.status
    };
}