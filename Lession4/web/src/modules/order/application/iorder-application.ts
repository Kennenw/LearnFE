import { PaginationResult } from '@core/types/common';
import { OrderApplicationCreateDTO, OrderApplicationViewDTO } from '../dtos/order-application-dto';

export default interface IOrderApplication {
    createOrderAsync(value: OrderApplicationCreateDTO): Promise<string>;
    getByUserId(id: string): Promise<PaginationResult<OrderApplicationViewDTO>>;
}
