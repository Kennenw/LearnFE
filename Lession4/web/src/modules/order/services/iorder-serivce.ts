import { PaginationResult } from '../../../core/types/common';
import { OrderCreateDTO, OrderUpdateDTO, OrderViewDTO } from "../dtos/order-dto";

export default interface IOrderService {
    createOrder(value: OrderCreateDTO): Promise<string>;
    getOrderById(id: string): Promise<PaginationResult<OrderViewDTO>>;
    updateOrder(id: string, value: OrderUpdateDTO): Promise<string>;
    deleteOrder(id: string): Promise<string>;
}