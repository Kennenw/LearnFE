import GenericRepository from "@infrastructure/database/repositories/generic-repository";
import IGenericRepository from "@core/interfaces/igeneric-repository";
import Order from "../models/order";
import IOrderService from "../services/iorder-service";
import OrderService from "../services/order-service";
import { OrderCreateDTO, OrderUpdateDTO } from "../dtos/order-dto";

const orderRepo: IGenericRepository<Order> = new GenericRepository<Order>('orders');
const orderService: IOrderService = new OrderService(orderRepo);

export const OrderController = {
    async createOrder(data: OrderCreateDTO) {
        return await orderService.createAsync(data);
    },

    async getOrderById(id: string) {
        return await orderService.getByIdAsync(id);
    },

    async updateOrder(data: OrderUpdateDTO) {
        return await orderService.updateAsync(data);
    },

    async deleteOrder(id: string) {
        return await orderService.deleteAsync(id);
    },

    async getOrdersByUserId(userId: string) {
        return await orderService.getByUserIdAsync(userId);
    }
};
