import { OrderStatus } from "@core/enum/order";
import BaseEntity from "@core/base/base-entity";

export default class Order extends BaseEntity {
    customerId: string;
    orderDate: Date;
    totalAmount: number;
    totalPrice: number;
    status: OrderStatus;
    shippingAddress: string | undefined;
    constructor(customerId: string, totalAmount: number, orderDate: Date,
        totalPrice: number, status: OrderStatus, shippingAddress?: string,
    ) {
        super();
        this.customerId = customerId;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.totalPrice = totalPrice
        this.status = status;
        this.shippingAddress = shippingAddress;
    }
}