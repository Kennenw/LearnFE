import { ProductStatus } from "../types/product";

export default class Product {
    id: number;
    name: string;
    description: string;
    categoryId: number;
    brandId: number;
    createdAt: Date;
    status: ProductStatus;
    constructor(id: number, name: string, description: string,
        categoryId: number, brandId: number, status: ProductStatus
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.categoryId = categoryId;
        this.brandId = brandId;
        this.createdAt = new Date();
        this.status = status;
    }
}