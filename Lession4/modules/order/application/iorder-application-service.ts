import { PaginationResult } from '../../../core/types/common';
import { OrderApplicationCreateDTO, OrderApplicationViewDTO } from '../dtos/order-application-dto';

export default interface IOrderApplicationService {
    createOrder(value: OrderApplicationCreateDTO): Promise<string>;
    getOrderByUserId(userId: string): Promise<PaginationResult<OrderApplicationViewDTO>>;
}