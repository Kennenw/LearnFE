import { OrderStatus } from "../../../core/enum/order";
import Order from "../models/order";

export interface OrderViewDTO {
    id: string;
    customerId: string;
    orderDate: Date;
    totalAmount: number;
    totalPrice: number;
    status: OrderStatus;
    shippingAddress: string;
}

export interface OrderCreateDTO {
    customerId: string;
    orderDate: Date;
    totalAmount: number;
    totalPrice: number;
    status: OrderStatus;
    shippingAddress?: string;
}

export interface OrderUpdateDTO extends Partial<Omit<Order, 'id' | 'customerId'>> {

}