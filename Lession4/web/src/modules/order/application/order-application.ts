import { PaginationResult } from "../../../core/types/common";
import { OrderApplicationCreateDTO, OrderApplicationViewDTO } from "../dtos/order-application-dto";
import IOrderApplication from "./iorder-application";

export default class OrderApplication implements IOrderApplication {
    createOrderAsync(value: OrderApplicationCreateDTO): Promise<string> {
        throw new Error("Method not implemented.");
    }
    getByUserId(id: string): Promise<PaginationResult<OrderApplicationViewDTO>> {
        throw new Error("Method not implemented.");
    }
    
}