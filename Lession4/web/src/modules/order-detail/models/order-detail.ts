import BaseEntity from "@core/base/base-entity";

export default class OrderDetail extends BaseEntity {
    orderId: string;
    productVariantId: string;
    quantity: number;
    price: number;
    constructor(orderId: string, productVariantId: string, quantity: number, price: number) {
        super();
        this.orderId = orderId;
        this.productVariantId = productVariantId;
        this.quantity = quantity;
        this.price = price;
    }
}