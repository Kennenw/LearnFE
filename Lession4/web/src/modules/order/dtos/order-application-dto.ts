import { OrderCreateDTO, OrderViewDTO } from "./order-dto";
import { OrderDetailCreateDTO, OrderDetailViewDTO } from "../../order-detail/dtos/order-detail-dto";

export interface OrderApplicationViewDTO {
    order: OrderViewDTO;
    details: OrderDetailViewDTO[];
}

export interface OrderApplicationCreateDTO {
    order: OrderCreateDTO;
    details: Omit<OrderDetailCreateDTO, 'orderId'>[];
}

export function toOrderDetailApplicationDTO(orderId: string, details: Omit<OrderDetailCreateDTO, 'orderId'>[]): OrderDetailCreateDTO[] {
    return details.map(detail => ({
        ...detail,
        orderId: orderId
    }));
}