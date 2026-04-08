import { Size } from "../../../core/enum/product-variant";
import BaseEntity from "../../../core/base/base-entity";

export default class ProductVariant extends BaseEntity {
    productId: string;
    size: Size;
    color: string;
    price: number;
    stockQuantity: number;
    constructor(productId: string, size: Size, color: string,
        price: number, stockQuantity: number) {
        super();
        this.productId = productId;
        this.size = size;
        this.color = color;
        this.price = price;
        this.stockQuantity = stockQuantity;
    }

    decreaseStock(stockQuantity: number): void | Error {
        if (stockQuantity <= 0) throw new Error("Số lượng phải lớn hơn 0");
        if (this.stockQuantity < stockQuantity) throw new Error("Không đủ số lượng");
        this.stockQuantity -= stockQuantity;
    }

    increaseStock(stockQuantity: number): void | Error {
        if (stockQuantity <= 0) throw new Error("Số lượng phải lớn hơn 0");
        this.stockQuantity += stockQuantity;
    }

}