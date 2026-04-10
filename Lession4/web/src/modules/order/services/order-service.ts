import { PaginationResult } from "../../../core/types/common";
import { OrderCreateDTO, OrderViewDTO, OrderUpdateDTO, toOrderViewDTO } from "../dtos/order-dto";
import Order from "../models/order";
import IOrderService from "./iorder-service";
import IGenenricRepository from "../../../core/interfaces/igeneric-repository";
import { Pagination } from "@core/utils/pagination";

export default class OrderService implements IOrderService {
    private orderRepo: IGenenricRepository<Order>;

    constructor(orderRepo: IGenenricRepository<Order>) {
        this.orderRepo = orderRepo;
    }

    async createAsync(value: OrderCreateDTO): Promise<string> {
        const id = await this.orderRepo.addAsync(value as unknown as Order);
        return "";
    }

    async getByIdAsync(id: string): Promise<OrderViewDTO | undefined> {
        const order = await this.orderRepo.getByIdAsync(id);
        if (order) {
            return toOrderViewDTO(order);
        }
        return undefined;
    }

    async updateAsync(value: OrderUpdateDTO): Promise<boolean> {
        if (!value.id) {
            return false;
        }
        const order = await this.getByIdAsync(value.id!);
        if (!order) {
            return false;
        }
        await this.orderRepo.editAsync(value.id, value);
        return true;
    }

    async deleteAsync(id: string): Promise<boolean> {
        const order = await this.getByIdAsync(id);
        if (!order) {
            return false;
        }
        await this.orderRepo.removeAsync(id);
        return true;
    }

    async getByUserIdAsync(id: string): Promise<PaginationResult<OrderViewDTO>> {
        const orders = await this.orderRepo.getAsync(undefined, undefined, queryDB => {
            return queryDB.select('*').eq('customerId', id);
        })
        const result = orders.data.map(order => toOrderViewDTO(order));
        return Pagination(result, orders.count);
    }
}