import { PaginationResult } from "@core/types/common";
import { OrderApplicationCreateDTO, OrderApplicationViewDTO, toOrderDetailApplicationDTO } from "../dtos/order-application-dto";
import IOrderApplication from "./iorder-application";
import IOrderService from "../services/iorder-service";
import IOrderDetailService from "@modules/order-detail/services/iorder-detail-service";

export default class OrderApplication implements IOrderApplication {
    private orderService: IOrderService;
    private orderDetailService: IOrderDetailService;

    constructor(orderService: IOrderService, orderDetailService: IOrderDetailService) {
        this.orderService = orderService;
        this.orderDetailService = orderDetailService;
    }

    async createOrderAsync(value: OrderApplicationCreateDTO): Promise<string> {
        const orderId = await this.orderService.createAsync(value.order);
        const details = toOrderDetailApplicationDTO(orderId, value.details);
        
        await Promise.all(details.map(detail => this.orderDetailService.addAsync(detail)));
        
        return orderId;
    }

    async getByUserId(id: string): Promise<PaginationResult<OrderApplicationViewDTO>> {
        const orders = await this.orderService.getByUserIdAsync(id);
        const result = await Promise.all(orders.data.map(async order => {
            const details = await this.orderDetailService.getByOrderIdAsync(order.id);
            return {
                order,
                details: details.data
            };
        }));
        return {
            ...orders,
            data: result
        };
    }
}
