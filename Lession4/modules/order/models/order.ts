import { OrderStatus } from "../../../core/enum/order";
import BaseEntity from "../../../core/base/base-entity";

export default class Order extends BaseEntity {
    customerId: string;
    orderDate: Date;
    totalAmount: number;
    totalPrice: number;
    status: OrderStatus;
    shippingAddress: string;
    constructor(customerId: string, totalAmount: number,
        totalPrice: number, status: OrderStatus, shippingAddress: string, 
    ) {
        super();
        this.customerId = customerId;
        this.orderDate = new Date();
        this.totalAmount = totalAmount;
        this.totalPrice = totalPrice
        this.status = status;
        this.shippingAddress = shippingAddress;
    }
}