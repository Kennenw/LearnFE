import { ProductStatus } from "@core/enum/product";
import BaseEntity from "@core/base/base-entity";
import Category from "@modules/category/models/category";
import Brand from "@modules/brand/models/brand";

export default class Product extends BaseEntity {
    name: string;
    description: string;
    categoryId: string;
    brandId: string;
    createdAt: Date;
    status: ProductStatus;
    categories?: Category;
    brands?: Brand;
    constructor(name: string, description: string,
        categoryId: string, brandId: string, status: ProductStatus
    ) {
        super();
        this.name = name;
        this.description = description;
        this.categoryId = categoryId;
        this.brandId = brandId;
        this.createdAt = new Date();
        this.status = status;
    }
}