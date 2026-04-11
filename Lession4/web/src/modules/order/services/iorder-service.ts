import { PaginationResult } from '@core/types/common';
import { OrderCreateDTO, OrderPaginationQuery, OrderUpdateDTO, OrderViewDTO } from "../dtos/order-dto";

export default interface IOrderService {
    createAsync(value: OrderCreateDTO): Promise<string>;
    getByIdAsync(id: string): Promise<OrderViewDTO | undefined>;
    updateAsync(value: OrderUpdateDTO): Promise<boolean>;
    deleteAsync(id: string): Promise<boolean>;
    getByUserIdAsync(id: string): Promise<PaginationResult<OrderViewDTO>>;
    getAsync(query: OrderPaginationQuery): Promise<PaginationResult<OrderViewDTO>>;
}