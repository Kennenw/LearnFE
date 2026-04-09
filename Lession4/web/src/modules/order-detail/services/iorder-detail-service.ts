import { PaginationResult } from "../../../core/types/common";
import { OrderDetailCreateDTO, OrderDetailUpdateDTO, OrderDetailViewDTO } from "../dtos/order-detail-dto";

export default interface IOrderDetailService {
    getOrderDetailByOrderId(id: string): Promise<PaginationResult<OrderDetailViewDTO>>;
    addOrderDetail(value: OrderDetailCreateDTO): Promise<string>;
    updateOrderDetail(id: string, value: OrderDetailUpdateDTO): Promise<string>;
    removeOrderDetail(id: string): Promise<string>;
}