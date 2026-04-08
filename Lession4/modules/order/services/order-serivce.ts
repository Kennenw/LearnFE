import { PaginationResult } from "../../../core/types/common";
import { OrderCreateDTO, OrderViewDTO, OrderUpdateDTO } from "../dtos/order-dto";
import IOrderService from "./iorder-serivce";

export default class OrderService implements IOrderService {

    
    createOrder(value: OrderCreateDTO): Promise<string> {
        throw new Error("Method not implemented.");
    }
    getOrderByUserId(userId: string): Promise<PaginationResult<OrderViewDTO>> {
        throw new Error("Method not implemented.");
    }
    updateOrder(id: string, value: OrderUpdateDTO): Promise<string> {
        throw new Error("Method not implemented.");
    }
    deleteOrder(id: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

}