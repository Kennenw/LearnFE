import Product from "../models/product";
import Category from "../../category/models/category";
import Brand from "../../brand/models/brand";
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
    sortByPrice?: Sort;
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

export function toProductViewDTO(product: Product, category: Category, brand: Brand): ProductViewDTO {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        categoryName: category.name,
        brandId: product.brandId,
        brandName: brand.name,
        status: product.status
    }
}