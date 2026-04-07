import { Size } from "../types/product-variant";

export default class ProductVariant {
    id: number;
    productId: number;
    size: Size;
    color: string;
    price: number;
    stockQuantity: number;
    constructor(id: number, productId: number, size: Size, color: string,
        price: number, stockQuantity: number) {
        this.id = id;
        this.productId = productId;
        this.size = size;
        this.color = color;
        this.price = price;
        this.stockQuantity = stockQuantity;
    }
    
    decreaseStock(stockQuantity: number): void | Error {
        if(stockQuantity <= 0) throw new Error("Số lượng phải lớn hơn 0");
        if(this.stockQuantity < stockQuantity) throw new Error("Không đủ số lượng");
        this.stockQuantity -= stockQuantity;
    }

    increaseStock(stockQuantity: number): void | Error {
        if(stockQuantity <= 0) throw new Error("Số lượng phải lớn hơn 0");
        this.stockQuantity += stockQuantity;
    }

}