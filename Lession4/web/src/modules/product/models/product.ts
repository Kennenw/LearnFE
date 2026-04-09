import { ProductStatus } from "@core/enum/product";
import BaseEntity from "@core/base/base-entity";

export default class Product extends BaseEntity {
    name: string;
    description: string;
    categoryId: string;
    brandId: string;
    createdAt: Date;
    status: ProductStatus;
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