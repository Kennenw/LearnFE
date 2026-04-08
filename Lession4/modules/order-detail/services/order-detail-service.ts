import { PaginationResult } from "../../../core/types/common";
import { OrderDetailViewDTO, OrderDetailCreateDTO, OrderDetailUpdateDTO } from "../dtos/order-detail-dto";
import IOrderDetailService from "./iorder-detail-service";

export default class OrderDetailService implements IOrderDetailService {
    getOrderDetailByOrderId(id: string): Promise<PaginationResult<OrderDetailViewDTO>> {
        throw new Error("Method not implemented.");
    }
    addOrderDetail(value: OrderDetailCreateDTO): Promise<string> {
        throw new Error("Method not implemented.");
    }
    updateOrderDetail(id: string, value: OrderDetailUpdateDTO): Promise<string> {
        throw new Error("Method not implemented.");
    }
    removeOrderDetail(id: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

}