import GenericRepository from "@infrastructure/database/repositories/generic-repository";
import IGenericRepository from "@core/interfaces/igeneric-repository";
import Order from "../models/order";
import OrderDetail from "@modules/order-detail/models/order-detail";
import IOrderService from "../services/iorder-service";
import OrderService from "../services/order-service";
import IOrderDetailService from "@modules/order-detail/services/iorder-detail-service";
import OrderDetailService from "@modules/order-detail/services/order-detail-service";
import { OrderPaginationQuery, OrderUpdateDTO } from "../dtos/order-dto";
import { OrderApplicationCreateDTO } from "../dtos/order-application-dto";
import IOrderApplication from "../application/iorder-application";
import OrderApplication from "../application/order-application";

const orderRepo: IGenericRepository<Order> = new GenericRepository<Order>('orders');
const orderDetailRepo: IGenericRepository<OrderDetail> = new GenericRepository<OrderDetail>('order_details');
const orderService: IOrderService = new OrderService(orderRepo);
const orderDetailService: IOrderDetailService = new OrderDetailService(orderDetailRepo);
const orderApplication: IOrderApplication = new OrderApplication(orderService, orderDetailService);

export const OrderController = {
    async createOrder(data: OrderApplicationCreateDTO) {
        return await orderApplication.createOrderAsync(data);
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
        return await orderApplication.getByUserId(userId);
    },

    async getOrders(query: OrderPaginationQuery) {
        return await orderService.getAsync(query);
    },

    async updateOrderStatus(id: string, status: any) {
        return await orderService.updateAsync({ id, status });
    }
};
