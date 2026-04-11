import { PaginationResult } from "@core/types/common";
import { OrderDetailCreateDTO, OrderDetailUpdateDTO, OrderDetailViewDTO } from "../dtos/order-detail-dto";

export default interface IOrderDetailService {
    getByOrderIdAsync(id: string): Promise<PaginationResult<OrderDetailViewDTO>>;
    addAsync(value: OrderDetailCreateDTO): Promise<string>;
    updateAsync(id: string, value: OrderDetailUpdateDTO): Promise<string>;
    removeAsync(id: string): Promise<string>;
}