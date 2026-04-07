import { OrderStatus } from "../types/order";

export default class Order{
    id: number;
    customerId: number;
    orderDate: Date;
    totalAmount: number;
    totalPrice: number;
    status: OrderStatus;
    shippingAddress: string;
    constructor(id: number, customerId: number, totalAmount: number,
        totalPrice: number, status: OrderStatus, shippingAddress: string, 
    ) {
        this.id = id;
        this.customerId = customerId;
        this.orderDate = new Date();
        this.totalAmount = totalAmount;
        this.totalPrice = totalPrice
        this.status = status;
        this.shippingAddress = shippingAddress;
    }
}