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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OrderUpdateDTO extends Partial<Omit<Order, 'customerId'>> {

}

export function toOrderViewDTO(value: Order): OrderViewDTO {
    return {
        id: value.id,
        customerId: value.customerId,
        orderDate: value.orderDate,
        totalAmount: value.totalAmount,
        totalPrice: 0,
        status: value.status,
        shippingAddress: value.shippingAddress ?? ""
    }
}