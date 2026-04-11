import { OrderStatus } from "@core/enum/order";
import { PaginationQuery } from "@core/types/common";

export interface OrderViewDTO {
    id: string;
    customerId: string;
    orderDate: Date;
    totalAmount: number;
    totalPrice: number;
    status: OrderStatus;
    shippingAddress: string;
}

export interface OrderPaginationQuery extends PaginationQuery {
    status?: OrderStatus;
    customerId?: string;
}

export interface OrderCreateDTO {
    customerId: string;
    orderDate: Date;
    totalAmount: number;
    totalPrice: number;
    status: OrderStatus;
    shippingAddress?: string;
}

export interface OrderUpdateDTO {
    id: string;
    status?: OrderStatus;
    shippingAddress?: string;
    totalAmount?: number;
    totalPrice?: number;
}

export function toOrderViewDTO(value: any): OrderViewDTO {
    return {
        id: value.id,
        customerId: value.customerId,
        orderDate: value.orderDate,
        totalAmount: value.totalAmount,
        totalPrice: value.totalPrice,
        status: value.status,
        shippingAddress: value.shippingAddress ?? ""
    }
}