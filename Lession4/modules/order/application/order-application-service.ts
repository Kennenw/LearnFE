import { PaginationResult } from "../../../core/types/common";
import { OrderApplicationCreateDTO, OrderApplicationViewDTO } from "../dtos/order-application-dto";
import IOrderApplicationService from "./iorder-application-service";

export default class OrderApplicationService implements IOrderApplicationService {
    createOrder(value: OrderApplicationCreateDTO): Promise<string> {
        throw new Error("Method not implemented.");
    }
    getOrderByUserId(userId: string): Promise<PaginationResult<OrderApplicationViewDTO>> {
        throw new Error("Method not implemented.");
    }
}