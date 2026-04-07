export default class OrderDetail{
    id: number;
    orderId: number;
    productVariantId: number;
    quantity: number;
    price: number;
    constructor(id: number, orderId: number, productVariantId: number, quantity: number, price: number) {
        this.id = id;
        this.orderId = orderId;
        this.productVariantId = productVariantId;
        this.quantity = quantity;
        this.price = price;
    }
}