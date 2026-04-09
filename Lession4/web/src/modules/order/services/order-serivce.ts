import { PaginationResult } from "../../../core/types/common";
import { OrderCreateDTO, OrderViewDTO, OrderUpdateDTO } from "../dtos/order-dto";
import Order from "../models/order";
import IOrderService from "./iorder-serivce";
import IGenenricRepository from "../../../core/interfaces/igeneric-repository";

export default class OrderService implements IOrderService {
    private orderRepo: IGenenricRepository<Order>;
    
    constructor(orderRepo: IGenenricRepository<Order>) {
        this.orderRepo = orderRepo;
    }

    getOrderById(id: string): Promise<PaginationResult<OrderViewDTO>> {
        throw new Error("Method not implemented.");
    }
    createOrder(value: OrderCreateDTO): Promise<string> {
        throw new Error("Method not implemented.");
    }
    updateOrder(id: string, value: OrderUpdateDTO): Promise<string> {
        throw new Error("Method not implemented.");
    }
    deleteOrder(id: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

}