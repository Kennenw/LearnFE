import { PaginationResult } from "../../../core/types/common";
import { OrderDetailViewDTO, OrderDetailCreateDTO, OrderDetailUpdateDTO } from "../dtos/order-detail-dto";
import IOrderDetailService from "./iorder-detail-service";

export default class OrderDetailService implements IOrderDetailService {
    getByOrderIdAsync(id: string): Promise<PaginationResult<OrderDetailViewDTO>> {
        throw new Error("Method not implemented.");
    }
    addAsync(value: OrderDetailCreateDTO): Promise<string> {
        throw new Error("Method not implemented.");
    }
    updateAsync(id: string, value: OrderDetailUpdateDTO): Promise<string> {
        throw new Error("Method not implemented.");
    }
    removeAsync(id: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    
}